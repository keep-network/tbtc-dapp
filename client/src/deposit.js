import {
  DepositFactory,
  Deposit,
  TBTCSystem,
  TBTCConstants,
  TBTCToken,
  TBTCDepositToken,
  ECDSAKeep,
  FeeRebateToken,
  VendingMachine,
  truffleToWeb3Contract,
} from './eth/contracts'

import { getKeepAddress } from './eventslog'

import { BigNumber } from 'bignumber.js'
BigNumber.config({ DECIMAL_PLACES: 8 })

import {
  BitcoinTxParser,
  Address,
} from 'tbtc-helpers'
import { btcInSatoshis, satoshisInBtc } from './btc'

const { Network, publicKeyToP2WPKHaddress } = Address

const tbtcInSatoshis = new BigNumber(10).pow(10)
const tbtcInBtc = tbtcInSatoshis.times(satoshisInBtc)

export const DepositStates = {
  // DOES NOT EXIST YET
  START: 0,

  // FUNDING FLOW
  AWAITING_SIGNER_SETUP: 1,
  AWAITING_BTC_FUNDING_PROOF: 2,

  // FAILED SETUP
  FRAUD_AWAITING_BTC_FUNDING_PROOF: 3,
  FAILED_SETUP: 4,

  // ACTIVE
  ACTIVE: 5,  // includes courtesy call

  // REDEMPTION FLOW
  AWAITING_WITHDRAWAL_SIGNATURE: 6,
  AWAITING_WITHDRAWAL_PROOF: 7,
  REDEEMED: 8,

  // SIGNER LIQUIDATION FLOW
  COURTESY_CALL: 9,
  FRAUD_LIQUIDATION_IN_PROGRESS: 10,
  LIQUIDATION_IN_PROGRESS: 11,
  LIQUIDATED: 12
}

/**
 * Gets the current state of the deposit.
 * @return {number} The deposit state, one of `DepositStates`
 */
export async function getDepositCurrentState(depositAddress) {
  const deposit = await Deposit.at(depositAddress)
  const state = await deposit.getCurrentState()
  return state
}

/**
 * Creates a new deposit and returns its address
 * @return {string} Address of the Deposit contract instance
 */
export async function createDeposit() {
  const depositFactory = await DepositFactory.deployed()
  const tbtcSystem = await TBTCSystem.deployed()
  const tbtcConstants = await TBTCConstants.deployed()
  const tbtcToken = await TBTCToken.deployed()
  const tbtcDepositToken = await TBTCDepositToken.deployed()
  const feeRebateToken = await FeeRebateToken.deployed()
  const vendingMachine = await VendingMachine.deployed()

  const _keepThreshold = '1'
  const _keepSize = '1'
  const _lotSize = satoshisInBtc.times(0.001).toString() // Hard-code 0.001 BTC lot size for now.

  // Get required funder bond value.
  const funderBond = await tbtcConstants.getFunderBondAmount()

  // Create new deposit.
  const result = await depositFactory.createDeposit(
    tbtcSystem.address,
    tbtcToken.address,
    tbtcDepositToken.address,
    feeRebateToken.address,
    vendingMachine.address,
    _keepThreshold,
    _keepSize,
    _lotSize,
    {
      value: funderBond,
    }
  )

  // Find event in logs
  const logs = result.logs.filter((log) => {
    return log.event == 'DepositCloneCreated' && log.address == depositFactory.address
  })

  const depositAddress = logs[0].args.depositCloneAddress
  return depositAddress
}


/**
 * Waits for Public Key publication event emitted by keep.
 * @param {string} depositAddress Address of the deposit.
 * @return {Buffer} Public key as concatenated x and y coordinates.
 */
export async function watchForPublicKeyPublished(depositAddress) {
  return new Promise(async (resolve, reject) => {
    const keepAddress = await getKeepAddress(depositAddress)
    const ecdsaKeep = truffleToWeb3Contract(await ECDSAKeep.at(keepAddress))

    // Start watching for events
    console.log(`Watching for PublicKeyPublished event `)
    ecdsaKeep.events.PublicKeyPublished()
      .once('data', function(event) {
        console.log(`Received event PublicKeyPublished [publicKey=${event.returnValues.publicKey}] for Keep [${keepAddress}]`)
        return resolve(event)
      })

    // As a workaround for a problem with MetaMask version 7.1.1 where subscription
    // for events doesn't work correctly we pull past events in a loop until
    // we find our event. This is a temporary solution which should be removed
    // after problem with MetaMask is solved.
    // See: https://github.com/MetaMask/metamask-extension/issues/7270
    const handle = setInterval(
      async function() {
        // Query if an event was already emitted after we start watching
        const events = await ecdsaKeep.getPastEvents('PublicKeyPublished', {
          fromBlock: 0,
          toBlock: 'latest',
        })

        if (events.length > 0) {
          const event = events[0]
          console.log(`Found event PublicKeyPublished [publicKey=${event.returnValues.publicKey}] for Keep [${keepAddress}]`)

          clearInterval(handle)

          return resolve(event)
        }
      },
      3000 // every 3 seconds
    )
  })
}

/**
 * Requests a Bitcoin public key for a Deposit and returns it as a Bitcoin address
 *
 * @param {string} depositAddress the address of a Deposit contract
 * @return {string} a bech32-encoded Bitcoin address, generated from a SegWit P2WPKH script
 * @throws {Error} An error if the deposit address could not be retrieved.
 */
export async function getDepositBtcAddress(depositAddress) {
  const deposit = await Deposit.at(depositAddress)

  // Check logs for an existing address; if we can't find one, submit the
  // transaction that will retrieve it, then try reading the newly-created
  // address from the logs again.
  const existingBtcAddress = await readDepositBtcAddressFromLogs(depositAddress)
  if (existingBtcAddress === null) {
    console.log(`Requesting Public Key for deposit [${deposit.address}]`)
    await deposit.retrieveSignerPubkey()
      .catch((err) => {
        // This can happen when the public key was already retrieved before
        // and we may succeed to get it with tbtcSystem.getPastEvents in the following lines
        // TODO: there may be other errors that this allows to pass, refactor in future
        console.error(`retrieveSignerPubkey failed: ${err}`)
      })

    const newBtcAddress = await readDepositBtcAddressFromLogs(depositAddress)
    if (newBtcAddress === null) {
      // Since the public key event is emitted in another contract, we can't get
      // this from result.logs
      // TODO: refactor, below we are retrieving the public key again
      throw new Error(`couldn't find RegisteredPubkey event for deposit address: [${depositAddress}]`)
    } else {
      return newBtcAddress
    }
  } else {
    return existingBtcAddress
  }
}

// Private helper to read the BTC address for the deposit at `depositAddress`
// from past on-chain events.
async function readDepositBtcAddressFromLogs(depositAddress) {
  const tbtcSystem = await TBTCSystem.deployed()

  const eventList = await tbtcSystem.getPastEvents(
    'RegisteredPubkey',
    {
      fromBlock: '0',
      toBlock: 'latest',
      filter: { _depositContractAddress: depositAddress },
    }
  )

  if (eventList.length == 0) {
    return null;
  }

  let publicKeyX = eventList[0].args._signingGroupPubkeyX
  let publicKeyY = eventList[0].args._signingGroupPubkeyY
  publicKeyX = publicKeyX.replace('0x', '')
  publicKeyY = publicKeyY.replace('0x', '')

  console.log(`Registered Public Key coordinates: X=[${publicKeyX}] Y=[${publicKeyY}]`)

  const btcAddress = publicKeyToP2WPKHaddress(
    `${publicKeyX}${publicKeyY}`,
    Network.testnet
  )

  console.log(`Calculated Bitcoin address: [${btcAddress}]`)

  return btcAddress
}

/**
 * Requests the amount of BTC needed to fund the deposit with the given address,
 * denominated in BTC, and the signer fee, also denominated in BTC.
 * 
 * @param {string} depositAddress the address of a Deposit contract
 * @return {object} An object with two properties, `lotInBtc` and
 *                  `signerFeeInBtc`, both BigNumber objects denominated in BTC.
 */
export async function getDepositBtcAmounts(depositAddress) {
  const deposit = await Deposit.at(depositAddress)

  // We do math using BigNumber.js as we need to return decimals, and bn.js only
  // supports integers.
  // getLotSizeBtc returns an amount in satoshis.
  const lotInSatoshis = await deposit.lotSizeSatoshis()
  const lotInBtc = new BigNumber(lotInSatoshis.toString()).times(btcInSatoshis)

  const signerFeeInTbtc = await deposit.signerFee()
  const signerFeeInBtc = new BigNumber(signerFeeInTbtc).div(tbtcInBtc) //.div(new BigNumber(signerDivisor.toString()))

  return {
    lotInBtc,
    signerFeeInBtc,
  }
}

/**
 * Calculates deposit funding proof and submits it to tBTC.
 * @param {string} depositAddress Deposit contract address.
 * @param {Proof} spvProof Transaction's SPV proof.
 * @param {number} fundingOutputIndex Position of a funding output in the transaction.
 * @return {string} ID of transaction submitting the proof to the deposit contract.
 */
export async function submitFundingProof(
  depositAddress,
  spvProof,
  fundingOutputIndex
) {
  // Parse transaction to get required details.
  let txDetails
  try {
    txDetails = await BitcoinTxParser.parse(spvProof.tx)
  } catch (err) {
    throw new Error(`failed to parse spv proof: [${err}]`)
  }

  // Call the vending machine shortcut to submit the funding proof
  // and mint TBTC.
  const vendingMachine = await VendingMachine.deployed()
  const tbtcDepositToken = await TBTCDepositToken.deployed()
  const tdtId = depositAddress

  await tbtcDepositToken.approve(
    vendingMachine.address,
    tdtId
  ).catch((err) => {
    throw new Error(`failed to approve TDT for transfer: [${err}]`)
  })

  const result = await vendingMachine.unqualifiedDepositToTbtc(
    depositAddress,
    Buffer.from(txDetails.version, 'hex'),
    Buffer.from(txDetails.txInVector, 'hex'),
    Buffer.from(txDetails.txOutVector, 'hex'),
    Buffer.from(txDetails.locktime, 'hex'),
    fundingOutputIndex,
    Buffer.from(spvProof.merkleProof, 'hex'),
    spvProof.txInBlockIndex,
    Buffer.from(spvProof.chainHeaders, 'hex')
  ).catch((err) => {
    throw new Error(`failed to submit funding transaction proof: [${err}]`)
  })

  return result.tx
}
