import {
  DepositFactory,
  Deposit,
  TBTCSystem,
  TBTCConstants,
  TBTCToken,
  ECDSAKeep,
  truffleToWeb3Contract,
} from './eth/contracts'

import { getKeepAddress } from './eventslog'

import {
  BitcoinTxParser,
  Address,
} from 'tbtc-helpers'

const { Network, publicKeyToP2WPKHaddress } = Address

/**
 * Creates a new deposit and returns its address
 * @return {string} Address of the Deposit contract instance
 */
export async function createDeposit() {
  const depositFactory = await DepositFactory.deployed()
  const tbtcSystem = await TBTCSystem.deployed()
  const tbtcConstants = await TBTCConstants.deployed()
  const tbtcToken = await TBTCToken.deployed()

  const _keepThreshold = '1'
  const _keepSize = '1'

  // Get required funder bond value.
  const funderBond = await tbtcConstants.getFunderBondAmount()

  // Create new deposit.
  const result = await depositFactory.createDeposit(
    tbtcSystem.address,
    tbtcToken.address,
    _keepThreshold,
    _keepSize,
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
 * @param {string} depositAddress the address of a Deposit contract
 * @return {string} a bech32-encoded Bitcoin address, generated from a SegWit P2WPKH script
 */
export async function getDepositBtcAddress(depositAddress) {
  const tbtcSystem = await TBTCSystem.deployed()
  const deposit = await Deposit.at(depositAddress)

  // 1. Request public key from the deposit
  console.log(`Requesting Public Key for deposit [${deposit.address}]`)
  await deposit.retrieveSignerPubkey()
    .catch((err) => {
      // This can happen when the public key was already retrieved before
      // and we may succeed to get it with tbtcSystem.getPastEvents in the following lines
      // TODO: there may be other errors that this allows to pass, refactor in future
      console.error(`retrieveSignerPubkey failed: ${err}`)
    })

  // 2. Parse the logs to get the public key.
  // Since the public key event is emitted in another contract, we can't get this from result.logs
  // TODO: refactor, below we are retrieving the public key again
  const eventList = await tbtcSystem.getPastEvents(
    'RegisteredPubkey',
    {
      fromBlock: '0',
      toBlock: 'latest',
      filter: { _depositContractAddress: depositAddress },
    }
  )

  if (eventList.length == 0) {
    throw new Error(`couldn't find RegisteredPubkey event for deposit address: [${depositAddress}]`)
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

  // Submit funding proof to the deposit contract.
  const deposit = await Deposit.at(depositAddress)

  const result = await deposit.provideBTCFundingProof(
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
