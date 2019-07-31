const Address = require('tbtc-helpers').Address

// PAGE 3: Pay BTC
async function getAddress(depositAddress) {
  // TODO: Implement:
  // 1. Get keep public key from the deposit
  // 2. Calculate P2WPKH address from the key
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
async function watchForFundingTransaction(electrumClient, bitcoinAddress, expectedValue) {
  const script = Address.addressToScript(bitcoinAddress)

  // This function is used as a callback to electrum client. It is invoked when
  // am existing or a new transaction is found.
  const checkIfFundingTransaction = async function(status) {
    // Check if status is null which means there are not transactions for the
    // script.
    if (status == null) {
      return null
    }

    // Get list of all unspent bitcoin transactions for the script.
    const unspentTransactions = await electrumClient.getUnspentToScript(script)

    // Check if any of unspent transactions has required value, if so
    // return this transaction.
    for (tx of unspentTransactions) {
      if (tx.value == expectedValue) {
        return {
          transactionID: tx.tx_hash,
          fundingOutputPosition: tx.tx_pos,
          value: tx.value,
        }
      }
    }
  }

  const fundingTransaction = await electrumClient.waitForTransactionToScript(
    script,
    checkIfFundingTransaction
  )
    .catch((err) => {
      return Promise.reject(new Error(`failed to wait for a transaction to hash: [${err}]`))
    })

  return fundingTransaction
}

// PAGE 4. WAITING FOR CONFIRMATIONS
async function waitForConfirmations(transactionID) {
  // TODO: Implement:
  // 1. Wait for required number of confirmations for the transaction
  // 2. Monitor confirmations on the chain and return when ready
}

module.exports = {
  getAddress, watchForFundingTransaction, waitForConfirmations,
}
