import {
  TBTCSystem,
  TBTCToken,
  KeepBridge,
  DepositFactory
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
async function initializeDeposit(depositAddress) {
  // TODO: Implement:
  // 1. Call deposit to create new keep
  // 2. Watch for ECDSAKeepCreated event from ECDSAKeepFactory contract
  // 3. call get public key
}
