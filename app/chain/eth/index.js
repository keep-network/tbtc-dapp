
const FundingProof = require('./../../../client/src/FundingProof')
import {
  TBTCSystem,
  TBTCToken,
  KeepBridge
} from './contracts'

let tbtcSystem
let tbtcToken
let keepBridge

tbtcSystem = await TBTCSystem.deployed()
tbtcToken = await TBTCToken.deployed()
keepBridge = await KeepBridge.deployed()


export async function createDeposit() {
  const deposit = await Deposit.new()
  console.log('new deposit deployed: ', deposit.address)
  
  const result = await deposit.createNewDeposit(
      tbtcSystem.address, // address _TBTCSystem
      tbtcToken.address, // address _TBTCToken
      keepBridge.address, // address _KeepBridge
      5, // uint256 _m
      10 // uint256 _n
  )

  // TODO: get deposit address
  // return deposit.address
}


// getDepositBTCPublicKey calls tBTC to fetch signer's public key from the keep dedicated
// for the deposit.
export async function getDepositBTCPublicKey(depositAddress) {
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
      filter: {
        _depositContractAddress: depositAddress
      }
    }
  )

  const publicKeyX = eventList[0].returnValues._signingGroupPubkeyX
  const publicKeyY = eventList[0].returnValues._signingGroupPubkeyY

  console.log(`Registered public key:\nX: ${publicKeyX}\nY: ${publicKeyY}`)
}


export function proveBtcDepositTx(depositAddress, fundingProof) {
  const deposit = await Deposit.at(depositAddress)

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

  // TODO return tx hash
  return result.tx
}