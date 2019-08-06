import { Network, publicKeyToP2WPKHaddress } from 'tbtc-helpers/src/Address';
import { Deposit, TBTCSystem } from './eth/contracts';

/**
 * Requests a Bitcoin public key for a Deposit and returns it as a Bitcoin address
 * @param {string} depositAddress the address of a Deposit contract
 * @returns a bech32-encoded Bitcoin address, generated from a SegWit P2WPKH script
 */
export async function getDepositBtcAddress(depositAddress) {
  const tbtcSystem = await TBTCSystem.deployed()
  
  // 1. Request public key from the deposit
  const deposit = await Deposit.at(depositAddress)

  console.log(`Call getPublicKey for deposit [${deposit.address}]`)

  await deposit.retrieveSignerPubkey()
    .catch((err)=> {
      // This can happen when the public key was already retrieved before 
      // and we may succeed to get it with tbtcSystem.getPastEvents in the following lines
      // TODO: there may be other errors that this allows to pass, refactor in future
      console.error(`retrieveSignerPubkey failed: ${err}`)
    })

  // 2. Parse the logs to get the public key
  // since the public key event is emitted in another contract, we
  // can't get this from result.logs
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

  let publicKeyX = eventList[0].args._signingGroupPubkeyX
  let publicKeyY = eventList[0].args._signingGroupPubkeyY
  publicKeyX = publicKeyX.replace('0x', '')
  publicKeyY = publicKeyY.replace('0x', '')

  console.log(`Registered public key for deposit ${depositAddress}:\nX: ${publicKeyX}\nY: ${publicKeyY}`)

  const btcAddress = publicKeyToP2WPKHaddress(
    `${publicKeyX}${publicKeyY}`,
    Network.testnet
  )
  return btcAddress
}

// Transition from PAGE 3 to PAGE 4
// 1. Wait for transaction on chain
// 2. Return transaction ID
export async function getFundingTransactionID(electrumConfig, bitcoinAddress) {
  // TODO: Implement
}

// PAGE 4. WAITING FOR CONFIRMATIONS
export async function waitForConfirmations(transactionID) {
  // TODO: Implement:
  // 1. Wait for required number of confirmations for the transaction
  // 2. Monitor confirmations on the chain and return when ready
}