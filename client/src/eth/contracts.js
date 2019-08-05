const TruffleContract = require("truffle-contract");

// Just a simple wrapper so we can prototype quickly
const artifacts = {
  require: (name) => {
    if(name.startsWith('./')) throw new Error("bad path")
    let contractName = name.split('.sol')[0]
    const json = require(`./artifacts/${contractName}.json`)
    const contract = TruffleContract(json)
    
    return contract
  }
}

export const Deposit = artifacts.require('Deposit.sol')
export const TBTCSystem = artifacts.require('TBTCSystem.sol')
export const TBTCToken = artifacts.require('TBTCToken.sol')
export const KeepBridge = artifacts.require('KeepBridge.sol')
export const DepositFactory = artifacts.require('DepositFactory.sol')

const contracts = [
  Deposit,
  TBTCSystem,
  TBTCToken,
  KeepBridge,
  DepositFactory
]

/**
 * Sets the default Web3 provider and transaction defaults for all tBTC contracts.
 * @param web3 The Web3 instance
 */
export async function setDefaults(web3) {
  const accounts = await web3.eth.getAccounts()
  const from = accounts[0]

  const txDefaults = { from }

  for(let contract of contracts) {
    contract.setProvider(web3.currentProvider)
    contract.defaults(txDefaults)
  }
}