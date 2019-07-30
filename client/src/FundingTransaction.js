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

// PAGE 4. WAITING FOR CONFIRMATIONS
async function waitForConfirmations(transactionID) {
  // TODO: Implement:
  // 1. Wait for required number of confirmations for the transaction
  // 2. Monitor confirmations on the chain and return when ready
}

module.exports = {
  getAddress, getFundingTransactionID, waitForConfirmations,
}
