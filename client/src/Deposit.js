import {
  DepositFactory,
  TBTCSystem,
  TBTCConstants,
  TBTCToken,
  ECDSAKeep,
  truffleToWeb3Contract,
} from './eth/contracts'

const web3 = require('web3')

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
 * Gets address of a keep created for the deposit. Finds the deposit creation
 * event and returns keep value emitted in the event.
 * @param {string} depositAddress Address of the deposit.
 * @return {string} Address of the keep.
 */
export async function getKeepAddress(depositAddress) {
  const tbtcSystem = await TBTCSystem.deployed()
  const events = await tbtcSystem.getPastEvents('Created', {
    fromBlock: 0,
    toBlock: 'latest',
    filter: { _depositContractAddress: depositAddress },
  })
  return events[0].returnValues._keepAddress
}

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
 * Gets public key of the keep. Finds a public key registration event and
 * returns a public key emitted in the event. Public key is logged in the event
 * as x and y coordinates, it concatenates these values.
 * @param {string} depositAddress Address of the deposit.
 * @return {Buffer} Public key as concatenated x and y coordinates.
 */
export async function getKeepPublicKey(depositAddress) {
  const depositLog = await TBTCSystem.deployed()

  const publickKeyEvents = await depositLog.getPastEvents(
    'RegisteredPubkey',
    {
      fromBlock: '0',
      toBlock: 'latest',
      filter: { _depositContractAddress: depositAddress },
    }
  )

  const publicKeyX = Buffer.from(web3.utils.hexToBytes(publickKeyEvents[0].returnValues._signingGroupPubkeyX))
  const publicKeyY = Buffer.from(web3.utils.hexToBytes(publickKeyEvents[0].returnValues._signingGroupPubkeyY))

  return Buffer.concat([Buffer.from(publicKeyX), Buffer.from(publicKeyY)])
}
