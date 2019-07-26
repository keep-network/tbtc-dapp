const TruffleContract = require("truffle-contract");



// TODO TruffleContract.setProvider here
// use Metamask
// also worthy noting that watching events is disabled in Web3 1.0 I think
// but polling works



// Just a simple wrapper so we can prototype quickly
const artifacts = {
  require: (name) => {
    if(name.startsWith('./')) throw new Error("bad path")
    const json = require(`./artifacts/${name}.json`)
    return TruffleContract(json)
  }
}

export const Deposit = artifacts.require('Deposit.sol')
export const TBTCSystem = artifacts.require('TBTCSystem.sol')
export const TBTCToken = artifacts.require('TBTCToken.sol')
export const KeepBridge = artifacts.require('KeepBridge.sol')