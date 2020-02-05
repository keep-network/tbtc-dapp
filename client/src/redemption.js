import {
  Deposit,
  TBTCSystem,
  TBTCToken,
  ECDSAKeep,
  VendingMachine,
  truffleToWeb3Contract,
  TBTCConstants,
} from './eth/contracts'

import { BitcoinTxParser } from 'tbtc-helpers'

import {
  oneInputOneOutputWitnessTX,
  addWitnessSignature,
} from './btc/transaction'

import { getTransactionProof } from './btc/proof'

import { getKeepAddress, getKeepPublicKey } from './eventslog'

const bcoin = require('bcoin/lib/bcoin-browser')

const web3 = require('web3')
const BN = web3.utils.BN

/**
 * Requests a redemption of the deposit.
 * @param {string} depositAddress Address of the deposit to redeem.
 * @param {string} redeemerAddress Address of the redeeming Ethereum account.
 * @param {string} toBTCAddress Bitcoin address to send redeemed funds to.
 */
export async function requestRedemption(depositAddress, redeemerAddress, toBTCAddress) {
  const deposit = await Deposit.at(depositAddress)
  const tbtcToken = await TBTCToken.deployed()
  const vendingMachine = await VendingMachine.deployed()
  const tbtcConstants = await TBTCConstants.deployed()

  // TODO: We set a fixed a value temporarily as the values are constants currently.
  // Find a way to get utxosize from the deposit.
  const utxoValue = await deposit.utxoSize()

  // TODO: Estimate fee with electrum
  const txFee = await tbtcConstants.getMinimumRedemptionFee() // MINIMUM_REDEMPTION_FEE from TBTCConstants

  let outputValueBytes
  try {
    const outputValue = new BN(utxoValue).sub(new BN(txFee))
    outputValueBytes = outputValue.toArrayLike(Buffer, 'le', 8)
  } catch (err) {
    throw new Error(`failed to calculate output value: [${err}]`)
  }

  let requesterPKH
  try {
    const script = bcoin.Script.fromAddress(toBTCAddress)
    requesterPKH = script.getWitnessPubkeyhash()
    if (requesterPKH == null) {
      throw "Not a P2WPKH address. Try again with a P2WPKH-supporting wallet."
    }
  } catch (err) {
    throw new Error(`failed to calculate requested public key hash: [${err}]`)
  }
  console.debug(`calculated requester public key hash: [${requesterPKH.toString('hex')}]`)

  // We approve the Deposit contract to transfer the maximum number of tokens
  // from the user's balance.
  // Temporary solution until TBTC includes approveAndCall support.
  // TODO: Replace after https://github.com/keep-network/tbtc/issues/273 is completed.
  const MAX_TOKEN_ALLOWANCE = (new BN(2)).pow(new BN(256)).sub(new BN(1))
  await tbtcToken.approve(vendingMachine.address, MAX_TOKEN_ALLOWANCE)
    .catch((err) => {
      throw new Error(`TBTC approval failed: [${err}]`)
    })

  const result = await vendingMachine.tbtcToBtc(
    depositAddress,
    outputValueBytes,
    requesterPKH,
    redeemerAddress,
  ).catch((err) => {
    throw new Error(`failed to request redemption: [${err.message}]`)
  })
  console.debug('redemption requested tx hash:', result.tx)
}

/**
 * Creates an unsigned redemption transaction for a deposit.
 * @param {string} depositAddress Address of the deposit.
 * @return {Object} Redemption transaction details containing unsigned transaction
 * in the hexadecimal format and digest of the transaction to be signed.
 */
export async function createUnsignedTransaction(depositAddress) {
  const redemptionDetails = await getLatestRedemptionDetails(depositAddress)
    .catch((err) => {
      throw new Error(`failed to get latest redemption details: [${err}]`)
    })
  console.debug('redemption details:', redemptionDetails)

  let outputValue
  let utxoSize
  let requestedFee
  try {
    utxoSize = new BN(redemptionDetails.utxoSize)
    requestedFee = new BN(redemptionDetails.requestedFee)

    outputValue = utxoSize.sub(requestedFee)
  } catch (err) {
    console.debug(`utxo size: [${utxoSize.toNumber()}], requested fee: [${requestedFee.toNumber()}]`)

    throw new Error(`failed to calculate output value: [${err}]`)
  }
  console.debug('calculated output value:', outputValue.toNumber())

  let unsignedTransaction
  try {
    unsignedTransaction = oneInputOneOutputWitnessTX(
      redemptionDetails.outpoint,
      // We set sequence to `0` to be able to replace by fee. It reflects
      // bitcoin-spv https://github.com/summa-tx/bitcoin-spv/blob/2a9d594d9b14080bdbff2a899c16ffbf40d62eef/solidity/contracts/CheckBitcoinSigs.sol#L154
      0,
      outputValue,
      redemptionDetails.requesterPKH
    )
  } catch (err) {
    throw new Error(`failed to generate transaction: [${err}]`)
  }
  console.debug('unsigned transaction:', unsignedTransaction)

  return { hex: unsignedTransaction, digest: redemptionDetails.digest }
}

/**
 * Gets details of requested redemption from the latest logged event for given
 * deposit.
 * @param {string} depositAddress Address of the deposit.
 * @return {Object} Redemption details.
 */
export async function getLatestRedemptionDetails(depositAddress) {
  const depositLog = await TBTCSystem.deployed()

  const redemptionEvents = await depositLog.getPastEvents(
    'RedemptionRequested',
    {
      filter: { _depositContractAddress: depositAddress },
      fromBlock: 0,
      toBlock: 'latest',
    }
  ).catch((err) => {
    return Error(`failed to get past redemption requested events: [${err}]`)
  })

  let latestRedemptionEvent
  if (redemptionEvents.length > 0) {
    latestRedemptionEvent = redemptionEvents[redemptionEvents.length - 1]
  } else {
    return Error(`redemption requested events list is empty`)
  }

  return {
    utxoSize: new BN(latestRedemptionEvent.returnValues._utxoSize),
    requesterPKH: Buffer.from(web3.utils.hexToBytes(latestRedemptionEvent.returnValues._requesterPKH)),
    requestedFee: new BN(latestRedemptionEvent.returnValues._requestedFee),
    outpoint: Buffer.from(web3.utils.hexToBytes(latestRedemptionEvent.returnValues._outpoint)),
    digest: Buffer.from(web3.utils.hexToBytes(latestRedemptionEvent.returnValues._digest)),
  }
}

/**
 * Watches chain for signature of the digest emitted by a keep of the given
 * deposit.
 * @param {string} depositAddress Address of the deposit.
 * @param {string} digest Digest to be signed.
 * @return {Object} Signature details: r, s, recoveryID, digest.
 */
export async function watchForSignatureSubmitted(depositAddress, digest) {
  const eventToResult = function(event) {
    return {
      r: Buffer.from(web3.utils.hexToBytes(event.returnValues.r)),
      s: Buffer.from(web3.utils.hexToBytes(event.returnValues.s)),
      recoveryID: new BN(event.returnValues.recoveryID),
      digest: Buffer.from(web3.utils.hexToBytes(event.returnValues.digest)),
    }
  }

  return new Promise(async (resolve, reject) => {
    const keepAddress = await getKeepAddress(depositAddress)
    const ecdsaKeep = truffleToWeb3Contract(await ECDSAKeep.at(keepAddress))

    // Start watching for events
    console.log(`Watching for SignatureSubmitted event `)
    ecdsaKeep.events.SignatureSubmitted()
      .on('data', function(event) {
        if (event.returnValues.digest === digest) {
          const result = eventToResult(event)

          console.debug(
            `received signature [r=${result.r.toString('hex')}, s=${result.s.toString('hex')}] ` +
            `for digest [${result.digest.toString('hex')}] from keep [${keepAddress}]`
          )

          return resolve(result)
        }
      })

    // As a workaround for a problem with MetaMask version 7.1.1 where subscription
    // for events doesn't work correctly we pull past events in a loop until
    // we find our event. This is a temporary solution which should be removed
    // after problem with MetaMask is solved.
    // See: https://github.com/MetaMask/metamask-extension/issues/7270
    const handle = setInterval(
      async function() {
        // Query if an event was already emitted after we start watching
        const events = await ecdsaKeep.getPastEvents('SignatureSubmitted', {
          fromBlock: 0,
          toBlock: 'latest',
          filter: { _digest: digest },
        })

        if (events.length > 0) {
          const result = eventToResult(events[0])

          console.debug(
            `found signature [r=${result.r.toString('hex')}, s=${result.s.toString('hex')}] ` +
            `for digest [${result.digest.toString('hex')}] from keep [${keepAddress}]`
          )
          clearInterval(handle)

          return resolve(result)
        }
      },
      3000 // every 3 seconds
    )
  })
}

/**
 * Submits a signature to the deposit.
 * @param {string} depositAddress Address of the deposit.
 * @param {Buffer} r Signature's r value.
 * @param {Buffer} s Signature's s value.
 * @param {BN} recoveryID Signature's recovery ID.
 */
export async function provideRedemptionSignature(depositAddress, r, s, recoveryID) {
  const deposit = await Deposit.at(depositAddress)

  // A constant in the Ethereum ECDSA signature scheme, used for public key recovery [1]
  // Value is inherited from Bitcoin's Electrum wallet [2]
  // [1] https://bitcoin.stackexchange.com/questions/38351/ecdsa-v-r-s-what-is-v/38909#38909
  // [2] https://github.com/ethereum/EIPs/issues/155#issuecomment-253810938
  const ETHEREUM_ECDSA_RECOVERY_V = new BN(27)
  const v = new BN(recoveryID).add(ETHEREUM_ECDSA_RECOVERY_V)

  const result = await deposit.provideRedemptionSignature(v, r, s)
    .catch((err) => {
      throw new Error(`failed to submit redemption proof: [${err}]`)
    })

  console.log('redemption signature provided in transaction:', result.tx)
}

/**
 * Adds a signature to the unsigned transaction.
 * @param {string} depositAddress Address of the deposit.
 * @param {string} unsignedTransaction Raw unsigned transaction in hexadecimal format.
 * @param {Buffer} r Signature's r value
 * @param {Buffer} s Signature's s value
 * @return {string} Signed redemption transaction in raw hexadecimal format.
 */
export async function combineSignedTransaction(
  depositAddress,
  unsignedTransaction,
  r,
  s
) {
  const keepPublicKey = await getKeepPublicKey(depositAddress)

  let signedTransaction
  try {
    signedTransaction = addWitnessSignature(
      unsignedTransaction,
      0,
      r,
      s,
      keepPublicKey
    )
  } catch (err) {
    throw new Error(`failed to add signature to transaction: [${err}]`)
  }

  console.debug('signed transaction:', signedTransaction)

  return signedTransaction
}

/**
 * Submits a bitcoin transaction proof to the deposit as a redemption proof.
 * @param {string} depositAddress Address of the deposit.
 * @param {string} txID ID of a bitcoin transaction.
 * @param {ElectrumClient} electrumClient Initialized electrum client.
 */
export async function provideRedemptionProof(depositAddress, txID, electrumClient) {
  const confirmations = 1

  const deposit = await Deposit.at(depositAddress)

  const spvProof = await getTransactionProof(electrumClient, txID, confirmations)

  // Parse transaction to get required details.
  let txDetails
  try {
    txDetails = await BitcoinTxParser.parse(spvProof.tx)
  } catch (err) {
    throw new Error(`failed to parse spv proof: [${err}]`)
  }

  // Submit redemption proof to the deposit contract.
  const result = await deposit.provideRedemptionProof(
    Buffer.from(txDetails.version, 'hex'),
    Buffer.from(txDetails.txInVector, 'hex'),
    Buffer.from(txDetails.txOutVector, 'hex'),
    Buffer.from(txDetails.locktime, 'hex'),
    Buffer.from(spvProof.merkleProof, 'hex'),
    spvProof.txInBlockIndex,
    Buffer.from(spvProof.chainHeaders, 'hex')
  ).catch((err) => {
    throw new Error(`failed to submit redemption proof: [${err}]`)
  })

  console.log('redemption proof provided in transaction:', result.tx)
}
