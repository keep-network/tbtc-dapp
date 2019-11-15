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
