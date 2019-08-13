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

async function getKeepAddress(depositAddress) {
  const tbtcSystem = await TBTCSystem.deployed()
  let evs = await tbtcSystem.getPastEvents('Created', { 
    fromBlock: 0, 
    toBlock: 'latest', 
    filter: { _depositContractAddress: depositAddress }
  })
  return evs[0].returnValues._keepAddress
}

export async function watchForPublicKeyPublished(depositAddress) {
  const deposit = await Deposit.at(depositAddress)
  const keepAddress = await getKeepAddress(depositAddress)
  const ecdsaKeep = truffleToWeb3Contract(await ECDSAKeep.at(keepAddress))
  
  let evs = await ecdsaKeep.getPastEvents('PublicKeyPublished', {
    fromBlock: 0,
    toBlock: 'latest'
  })

  if(evs.length != 0) {
    const publicKeyPublishedEvent = evs[0]
    console.log(`Found event PublicKeyPublished [publicKey=${publicKeyPublishedEvent.returnValues.publicKey}] for Keep [${keepAddress}]`)
    return publicKeyPublishedEvent
  }
  
  console.log(`Watching for PublicKeyPublished event `)
  const publicKeyPublished = await new Promise((res, rej) => {
    ecdsaKeep.events.PublicKeyPublished()
      .once('data', function(event) {
        res(event)
      })
  })

  const publicKeyPublishedEvent = await promiseWithTimeout(publicKeyPublished, 60000)
  console.log(`Received event PublicKeyPublished [publicKey=${publicKeyPublishedEvent.returnValues.publicKey}] for Keep [${keepAddress}]`)
  
  return publicKeyPublishedEvent
}