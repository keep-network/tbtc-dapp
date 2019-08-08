import { DepositFactory, KeepBridge, TBTCSystem, TBTCToken } from './eth/contracts';

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
  let logs = result.logs.filter(log => {
    return log.event == 'DepositCloneCreated' && log.address == depositFactory.address
  })

  const depositAddress = logs[0].args.depositCloneAddress
  return depositAddress
}