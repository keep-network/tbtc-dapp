const ElectrumClient = require('tbtc-helpers').ElectrumClient
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
 * @property {number} blockHeight Height of the block when transaction was mined.
 * @property {number} value Value of the funding output (satoshis).
*/

/**
 * Waits for a transaction sent to a bitcoin address.
 * @param {string} bitcoinAddress Bitcoin address to monitor.
 * @return {FundingTransaction} Transaction details.
 */
async function awaitFundingTransaction(bitcoinAddress) {
  const script = Address.addressToScript(bitcoinAddress)

  const client = new ElectrumClient.Client(electrumConfig)

  client.connect()
    .catch((err) => {
      return Promise.reject(new Error(`failed to connect electrum client: ${err}`))
    })

  await client.waitForTransactionToScript(script)
    .catch((err) => {
      return Promise.reject(new Error(`failed to wait for a transaction to hash: ${err}`))
    })

  const unspentTransactions = await client.getUnspentToScript(script)

  if (unspentTransactions.length != 1) {
    return Promise.reject(new Error(`unexpected number of unspent outputs: [${unspentTransactions.length}], but want [1]`))
  }

  client.close()
    .catch((err) => {
      return Promise.reject(new Error(`failed to close electrum client connection: ${err}`))
    })

  return {
    transactionID: unspentTransactions[0].tx_hash,
    fundingOutputPosition: unspentTransactions[0].tx_pos,
    blockHeight: unspentTransactions[0].height,
    value: unspentTransactions[0].value,
  }
}

// PAGE 4. WAITING FOR CONFIRMATIONS
async function waitForConfirmations(transactionID) {
  // TODO: Implement:
  // 1. Wait for required number of confirmations for the transaction
  // 2. Monitor confirmations on the chain and return when ready
}

module.exports = {
  getAddress, getFundingTransactionID: awaitFundingTransaction, waitForConfirmations,
}
