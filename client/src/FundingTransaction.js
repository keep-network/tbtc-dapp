import { Address } from 'tbtc-helpers'
import { Deposit, TBTCSystem, truffleToWeb3Contract } from './eth/contracts'
import { Deferred, promiseWithTimeout } from './util'
const { Network, publicKeyToP2WPKHaddress, addressToScript } = Address

/**
 * Requests a Bitcoin public key for a Deposit and returns it as a Bitcoin address
 * @param {string} depositAddress the address of a Deposit contract
 * @return {string} a bech32-encoded Bitcoin address, generated from a SegWit P2WPKH script
 */
export async function getDepositBtcAddress(depositAddress) {
  const tbtcSystem = truffleToWeb3Contract(await TBTCSystem.deployed())

  const deposit = await Deposit.at(depositAddress)

  // 1. Listen for the public key registration event, before we request it
  //    This is to avoid race conditions.
  const registeredPubKeyEvent = new Deferred()
  tbtcSystem.events.RegisteredPubkey({ filter: { _depositContractAddress: depositAddress } })
    .once('data', function(event) {
      registeredPubKeyEvent.resolve(event)
    })

  console.log(`Get Public Key for deposit [${deposit.address}]`)

  // 2. Request public key from the deposit
  await deposit.retrieveSignerPubkey()
    .catch((err) => {
      // This can happen when the public key was already retrieved before
      // and we may succeed to get it with tbtcSystem.getPastEvents in the following lines
      // TODO: there may be other errors that this allows to pass, refactor in future
      console.error(`retrieveSignerPubkey failed: ${err}`)
    })

  // 3. Wait for the event to be emitted, or time out after 45s
  const event = await promiseWithTimeout(registeredPubKeyEvent.promise, 45000)
    .catch((err) => {
      throw new Error(`couldn't find RegisteredPubkey event for deposit address: [${depositAddress}]\nError: ${err}`)
    })
  
  let publicKeyX = event.returnValues._signingGroupPubkeyX
  let publicKeyY = event.returnValues._signingGroupPubkeyY
  publicKeyX = publicKeyX.replace('0x', '')
  publicKeyY = publicKeyY.replace('0x', '')

  console.log(`Registered Public Key coordinates: X=[${publicKeyX}] Y=[${publicKeyY}]`)

  const btcAddress = publicKeyToP2WPKHaddress(
    `${publicKeyX}${publicKeyY}`,
    Network.testnet
  )

  console.log(`Calculated Bitcoin address: [${btcAddress}]`)

  return btcAddress
}

/**
 * Funding transaction details.
 * @typedef FundingTransaction
 * @type {Object}
 * @property {string} transactionID Transaction ID.
 * @property {number} fundingOutputPosition Position of funding output in the transaction.
 * @property {number} value Value of the funding output (satoshis).
*/

/**
 * Waits for a funding transaction sent to a bitcoin address.
 * @param {ElectrumClient} electrumClient Electrum Client instance.
 * @param {string} bitcoinAddress Bitcoin address to monitor.
 * @param {number} expectedValue Expected transaction output value (satoshis).
 * @return {FundingTransaction} Transaction details.
 */
export async function watchForFundingTransaction(electrumClient, bitcoinAddress, expectedValue) {
  const script = addressToScript(bitcoinAddress)

  // This function is used as a callback to electrum client. It is invoked when
  // am existing or a new transaction is found.
  const findFundingTransaction = async function(status) {
    // Check if status is null which means there are not transactions for the
    // script.
    if (status == null) {
      return null
    }

    // Get list of all unspent bitcoin transactions for the script.
    const unspentTransactions = await electrumClient.getUnspentToScript(script)

    // Check if any of unspent transactions has required value, if so
    // return this transaction.
    for (const tx of unspentTransactions) {
      if (tx.value == expectedValue) {
        return {
          transactionID: tx.tx_hash,
          fundingOutputPosition: tx.tx_pos,
          value: tx.value,
        }
      }
    }
  }

  const fundingTransaction = await electrumClient.onTransactionToScript(
    script,
    findFundingTransaction
  ).catch((err) => {
    return new Error(`failed to wait for a transaction to hash: [${err}]`)
  })

  return fundingTransaction
}

/**
 * Waits until funding transaction gets required number of confirmations.
 * @param {ElectrumClient} electrumClient Electrum Client instance.
 * @param {string} transactionID Transaction ID.
 * @return {string} Number of confirmations for the transaction.
 * TODO: When we increase required confirmations number above 1 we should probably
 * emit an event for each new confirmation to update state in the web app.
 */
export async function waitForConfirmations(electrumClient, transactionID) {
  const requiredConfirmations = 1 // TODO: This is simplification for demo

  const checkConfirmations = async function() {
    // Get current state of the transaction.
    const tx = await electrumClient.getTransaction(transactionID)

    // Check if the transaction has enough confirmations.
    if (tx.confirmations >= requiredConfirmations) {
      return tx.confirmations
    }
  }

  const confirmations = await electrumClient.onNewBlock(checkConfirmations)
    .catch((err) => {
      throw new Error(`failed to wait for a transaction confirmations: [${err}]`)
    })

  return confirmations
}
