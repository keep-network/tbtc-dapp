import { Network, publicKeyToP2WPKHaddress } from 'tbtc-helpers/src/Address';
import { Deposit, TBTCSystem } from './eth/contracts';

/**
 * Requests a Bitcoin public key for a Deposit and returns it as a Bitcoin address
 * @param {string} depositAddress the address of a Deposit contract
 * @returns a bech32-encoded Bitcoin address, generated from a SegWit P2WPKH script
 */
export async function getDepositBtcAddress(depositAddress) {
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

  console.log(`Registered public key for deposit ${depositAddress}:\nX: ${publicKeyX}\nY: ${publicKeyY}`)

  const address = publicKeyToP2WPKHaddress(
    `${publicKeyX.slice(2)}${publicKeyY.slice(2)}`,
    Network.testnet
  )
  return address
}

// A complement to getDepositBTCPublicKey.
// We don't use this function yet, because we are only on testnet
// On testnet, there is a race between us getting the deposit address
// and keep-tecdsa submitting the key, before we can start listening for it
// Leaving it here for future.
async function watchForDepositBtcAddress(depositAddress) {
  const tbtcSystem = await TBTCSystem.deployed()

  return await new Promise((res, rej) => {
    tbtcSystem.RegisteredPubkey({ _depositContractAddress: depositAddress }).on('data', function(data) {
      console.log(`Registered public key for deposit ${depositAddress}:\nX: ${publicKeyX}\nY: ${publicKeyY}`)
      res(data)
    })

    setTimeout(rej, 15000)
  })
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