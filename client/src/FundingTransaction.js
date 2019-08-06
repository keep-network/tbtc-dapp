import { Address } from 'tbtc-helpers'
const { Network, publicKeyToP2WPKHaddress, addressToScript } = Address
import { Deposit, TBTCSystem } from './eth/contracts'

/**
 * Requests a Bitcoin public key for a Deposit and returns it as a Bitcoin address
 * @param {string} depositAddress the address of a Deposit contract
 * @return {string} a bech32-encoded Bitcoin address, generated from a SegWit P2WPKH script
 */
export async function getDepositBtcAddress(depositAddress) {
  const tbtcSystem = await TBTCSystem.deployed()

  // 1. Request public key from the deposit
  const deposit = await Deposit.at(depositAddress)

  console.log(`Call getPublicKey for deposit [${deposit.address}]`)

  await deposit.retrieveSignerPubkey()
    .catch((err) => {
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

  if (eventList.length == 0) {
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
  const findFundingTransaction = async function (status) {
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

// PAGE 4. WAITING FOR CONFIRMATIONS
export async function waitForConfirmations(transactionID) {
  // TODO: Implement:
  // 1. Wait for required number of confirmations for the transaction
  // 2. Monitor confirmations on the chain and return when ready
}