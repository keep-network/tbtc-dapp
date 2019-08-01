import {
  TBTCSystem,
  TBTCToken,
  KeepBridge,
  DepositFactory,
  Deposit
} from './eth/contracts'

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



// PAGE 2: PUT A BOND
export async function initializeDeposit(depositAddress) {
}

export async function waitDepositBTCPublicKey(depositAddress) {
  const tbtcSystem = await TBTCSystem.deployed()

  return await new Promise((res, rej) => {
    tbtcSystem.RegisteredPubkey({ _depositContractAddress: depositAddress }).on('data', function(data) {
      console.log(data)
      res(data)
      // https://docs.google.com/document/d/1ekLFGnMsjDIRkjGPifbxHcJeUYLCEvhHISPCl5H1E6s/edit?usp=sharing
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

  let result
  try {
    result = await deposit.retrieveSignerPubkey()
  } catch(err) {
    console.error(`retrieveSignerPubkey failed: ${err}`)
  }

  // 2. Parse the logs to get it
  const eventList = await tbtcSystem.getPastEvents(
    'RegisteredPubkey', 
    {
      fromBlock: '0',
      toBlock: 'latest',
      filter: { _depositContractAddress: depositAddress }
    }
  )

  const publicKeyX = eventList[0].args._signingGroupPubkeyX
  const publicKeyY = eventList[0].args._signingGroupPubkeyY

  console.log(`Registered public key:\nX: ${publicKeyX}\nY: ${publicKeyY}`)

  return [publicKeyX, publicKeyY]
}