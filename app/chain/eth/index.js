const TruffleContract = require("truffle-contract");
const FundingProof = require('./../../../client/src/FundingProof')

// Just a simple wrapper so we can prototype quickly
const artifacts = {
  require: (name) => {
    const json = require(`./artifacts/${name}.json`)
    return TruffleContract(json)
  }
}

const Deposit = artifacts.require('./Deposit.sol')
const TBTCSystem = artifacts.require('./TBTCSystem.sol')
const TBTCToken = artifacts.require('./TBTCToken.sol')
const KeepBridge = artifacts.require('./KeepBridge.sol')


let deposit
let tbtcSystem
let tbtcToken
let keepBridge

tbtcSystem = await TBTCSystem.deployed()
tbtcToken = await TBTCToken.deployed()
keepBridge = await KeepBridge.deployed()
    


async function createDeposit() {
  deposit = await Deposit.new()
  console.log('new deposit deployed: ', deposit.address)
  
  const result = await deposit.createNewDeposit(
      tbtcSystem.address, // address _TBTCSystem
      tbtcToken.address, // address _TBTCToken
      keepBridge.address, // address _KeepBridge
      5, // uint256 _m
      10 // uint256 _n
  )  
}


// getDepositBTCPublicKey calls tBTC to fetch signer's public key from the keep dedicated
// for the deposit.
async function getDepositBTCPublicKey(depositAddress) {
  // 1. Request it from the deposit
  const deposit = await Deposit.at(depositAddress)

  console.log(`Call getPublicKey for deposit [${deposit.address}]`)

  let result
  try {
    result = await deposit.retrieveSignerPubkey()
  } catch(err) {
    console.error(`retrieveSignerPubkey failed: ${err}`)
  }

  console.log('retrieveSignerPubkey transaction: ', result.tx)

  // 2. Parse the logs to get it
  const eventList = await tbtcSystem.getPastEvents(
    'RegisteredPubkey', 
    {
      fromBlock: startBlockNumber,
      toBlock: 'latest',
      filter: {
        _depositContractAddress: depositAddress
      }
    }
  )

  const publicKeyX = eventList[0].returnValues._signingGroupPubkeyX
  const publicKeyY = eventList[0].returnValues._signingGroupPubkeyY

  console.log(`Registered public key:\nX: ${publicKeyX}\nY: ${publicKeyY}`)
}

// publicKeyToP2WPKHaddress
// networkToBCOINvalue



// get transaction
function getTransactionProof(depositAddress) {
  const deposit = await Deposit.at(depositAddress)

  const fundingProof = await FundingProof.getTransactionProof(electrumConfig, txId, confirmations)

  let result
  try {
    result = await deposit.provideBTCFundingProof(
      fundingProof.version,
      fundingProof.txInVector,
      fundingProof.txOutVector,
      fundingProof.locktime,
      fundingProof.fundingOutputIndex,
      fundingProof.merkleProof,
      fundingProof.txInBlockIndex,
      fundingProof.chainHeaders
    )
  } catch(err) {
    throw new Error(`provideBTCFundingProof failed: ${err}`)
  }

  // await tbtcSystem.getPastEvents(
  //   'Funded', 
  //   {
  //     fromBlock: startBlockNumber,
  //     toBlock: 'latest',
  //     filter: {
  //       _depositContractAddress: depositAddress
  //     }
  //   }
  // )
}