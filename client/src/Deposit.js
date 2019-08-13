import { DepositFactory, KeepBridge, TBTCSystem, TBTCToken, truffleToWeb3Contract, ECDSAKeep, Deposit } from './eth/contracts'
import { Deferred, promiseWithTimeout } from './util'

/**
 * Creates a new deposit and returns its address
 * @return {string} Address of the Deposit contract instance
 */
export async function createDeposit() {
  const tbtcSystem = await TBTCSystem.deployed()
  const tbtcToken = await TBTCToken.deployed()
  const keepBridge = await KeepBridge.deployed()
  const depositFactory = await DepositFactory.deployed()

  const _keepThreshold = '1'
  const _keepSize = '1'

  const result = await depositFactory.createDeposit(
    tbtcSystem.address,
    tbtcToken.address,
    keepBridge.address,
    _keepThreshold,
    _keepSize
  )

  // Find event in logs
  const logs = result.logs.filter((log) => {
    return log.event == 'DepositCloneCreated' && log.address == depositFactory.address
  })

  const depositAddress = logs[0].args.depositCloneAddress
  return depositAddress
}

export async function watchForPublicKeyPublished(depositAddress) {
  const deposit = await Deposit.at(depositAddress)
  const keepAddress = await deposit.keepAddress()
  const ecdsaKeep = truffleToWeb3Contract(await ECDSAKeep.at(keepAddress))

  const publicKeyPublished = new Deferred()
  console.log(`Watching for PublicKeyPublished event for Keep [${keepAddress}]`)
  ecdsaKeep.events.PublicKeyPublished()
    .once('data', function(event) {
      publicKeyPublished.resolve(event)
    })
  
  const publicKeyPublishedEvent = await promiseWithTimeout(publicKeyPublished.promise, 45000)
    .catch((err) => {
      throw new Error(`couldn't find RegisteredPubkey event for deposit address: [${depositAddress}]\nError: ${err}`)
    })
  
  console.log(`Received event PublicKeyPublished [publicKey=${publicKeyPublishedEvent.returnValues.publicKey}] for Keep [${keepAddress}]`)
  
  return publicKeyPublishedEvent
}