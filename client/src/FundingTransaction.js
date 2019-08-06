// PAGE 3: Pay BTC
async function getAddress(depositAddress) {
  // TODO: Implement:
  // 1. Get keep public key from the deposit
  // 2. Calculate P2WPKH address from the key
}

// Transition from PAGE 3 to PAGE 4
// 1. Wait for transaction on chain
// 2. Return transaction ID
async function getFundingTransactionID(electrumConfig, bitcoinAddress) {
  // TODO: Implement
}

/**
 * Waits until funding transaction gets required number of confirmations.
 * @param {ElectrumClient} electrumClient Electrum Client instance.
 * @param {string} transactionID Transaction ID.
 * @return {string} Number of confirmations for the transaction.
 * TODO: When we increase required confirmations number above 1 we should probably
 * emit an event for each new confirmation to update state in the web app.
 */
async function waitForConfirmations(electrumClient, transactionID) {
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

module.exports = {
  getAddress,
  getFundingTransactionID,
  waitForConfirmations,
}
