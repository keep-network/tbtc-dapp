import {
  TBTCSystem,
  TBTCToken,
  KeepBridge,
  DepositFactory,
  Deposit
} from './eth/contracts'

import {
  publicKeyToP2WPKHaddress,
  Network
} from '../../lib/tbtc-helpers/src/Address'

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
  let logs = result.logs.filter(log => {
    return log.event == 'DepositCloneCreated' && log.address == depositFactory.address
  })

  const depositAddress = logs[0].args.depositCloneAddress

  return depositAddress
}



export async function waitDepositBTCPublicKey(depositAddress) {
  const tbtcSystem = await TBTCSystem.deployed()

  return await new Promise((res, rej) => {
    tbtcSystem.RegisteredPubkey({ _depositContractAddress: depositAddress }).on('data', function(data) {
      console.log(data)
      res(data)
    })

    setTimeout(rej, 15000)
  })
}

// getDepositBTCPublicKey calls tBTC to fetch signer's public key from the keep dedicated
// for the deposit.
export async function getDepositBTCPublicKey(depositAddress) {
  const tbtcSystem = await TBTCSystem.deployed()
  
  // 1. Request it from the deposit
  const deposit = await Deposit.at(depositAddress)

  console.log(`Call getPublicKey for deposit [${deposit.address}]`)

  let result = await deposit.retrieveSignerPubkey()
    .catch((err)=> {
      console.error(`retrieveSignerPubkey failed: ${err}`)
    })

  // 2. Parse the logs to get it
  // we can't get this from result.logs, since it's emitted in another contract
  const eventList = await tbtcSystem.getPastEvents(
    'RegisteredPubkey', 
    {
      fromBlock: '0',
      toBlock: 'latest',
      filter: { _depositContractAddress: depositAddress }
    }
  )

  if(eventList.length == 0) {
    throw new Error(`couldn't find RegisteredPubkey event for deposit address: ${depositAddress}`)
  }

  const publicKeyX = eventList[0].args._signingGroupPubkeyX
  const publicKeyY = eventList[0].args._signingGroupPubkeyY

  console.log(`Registered public key:\nX: ${publicKeyX}\nY: ${publicKeyY}`)

  const address = publicKeyToP2WPKHaddress(
    `${publicKeyX.slice(2)}${publicKeyY.slice(2)}`,
    Network.testnet
  )
  return address
}