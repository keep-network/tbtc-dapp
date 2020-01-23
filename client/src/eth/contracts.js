const TruffleContract = require('truffle-contract')
const Web3 = require('web3')

// Just a simple wrapper so we can prototype quickly
const artifacts = {
  require: (name) => {
    if (name.startsWith('./')) throw new Error('bad path')
    const contractName = name.split('.sol')[0]
    const json = require(`./artifacts/${contractName}.json`)
    const contract = TruffleContract(json)

    return contract
  }
}

export const DepositFactory = artifacts.require('DepositFactory.sol')
export const Deposit = artifacts.require('Deposit.sol')
export const TBTCSystem = artifacts.require('TBTCSystem.sol')
export const TBTCConstants = artifacts.require('TBTCConstants.sol')
export const TBTCToken = artifacts.require('TBTCToken.sol')
export const TBTCDepositToken = artifacts.require('TBTCDepositToken.sol')
export const ECDSAKeep = artifacts.require('ECDSAKeep.sol')
export const VendingMachine = artifacts.require('VendingMachine.sol')
export const FeeRebateToken = artifacts.require('FeeRebateToken.sol')

const contracts = [
  DepositFactory,
  Deposit,
  TBTCSystem,
  TBTCConstants,
  TBTCToken,
  TBTCDepositToken,
  ECDSAKeep,
  VendingMachine,
  FeeRebateToken,
]

/**
 * Sets the default Web3 provider and transaction defaults for all tBTC contracts.
 * @param web3 The Web3 instance
 */
export async function setDefaults(web3) {
  const accounts = await web3.eth.getAccounts()
  const from = accounts[0]

  const txDefaults = { from }

  for (let contract of contracts) {
    contract.setProvider(web3.currentProvider)
    contract.defaults(txDefaults)
  }
}

/**
 * Wraps a Truffle contract into a Web3 contract
 * Useful for contract events, for which Truffle has NO documentation
 * TODO standardise on one Web3 provider (Truffle/Web3)
 * @param {*} truffleContract TruffleContract instance
 * @returns {web3.eth.Contract} a Web3 contract
 */
export function truffleToWeb3Contract(truffleContract) {
  const web3 = new Web3(truffleContract.contract.currentProvider)
  let contract = new web3.eth.Contract(
    truffleContract.abi,
    truffleContract.address
  )
  return contract
}
