const BitcoinTxParser = require('tbtc-helpers').BitcoinTxParser
const bitcoinSPV = require('tbtc-helpers').BitcoinSPV
const ElectrumClient = require('tbtc-helpers').ElectrumClient


let electrumConfig

export function setElectrumConfig(config) {
  electrumConfig = config
  // readElectrumConfig(process.env.CONFIG_FILE)
}


/**
 * Reads electrum client configuration details from a config file.
 * @param {string} configFilePath Path to the configuration file.
 * @return {ElectrumClient.Config} Electrum client configuration.
 */
function readElectrumConfig(configFilePath) {
  const configFile = fs.readFileSync(configFilePath, 'utf8')
  config = JSON.parse(configFile)

  return new ElectrumClient.Config(
    config.electrum.testnet.server,
    config.electrum.testnet.port,
    config.electrum.testnet.protocol
  )
}

/**
 * Gets transaction SPV proof from BitcoinSPV.
 * @param {string} txID Transaction ID
 * @param {number} confirmations Required number of confirmations
 */
async function getTransactionProof(txID, confirmations) {
  bitcoinSPV.initialize(electrumConfig)

  const spvProof = await bitcoinSPV.getTransactionProof(txID, confirmations)
    .catch((err) => {
      bitcoinSPV.close()
      return Promise.reject(new Error(`failed to get bitcoin spv proof: ${err}`))
    })

  bitcoinSPV.close()

  return {
    merkleProof: spvProof.merkleProof,
    txInBlockIndex: spvProof.txInBlockIndex,
    chainHeaders: spvProof.chainHeaders,
  }
}

// PAGE 5: Submit Proof
// 1. Get transaction proof
// 2. Submit proof to tBTC

/**
 * Calculates deposit funding proof and submits it to tBTC.
 * @param {string} txID Funding transaction ID.
 * @param {number} fundingOutputIndex Position of a funding output in the transaction.
 */
async function calculateAndSubmitFundingProof(txID, fundingOutputIndex) {
  if (txID.length != 64) {
    return Promise.reject(
      new Error(`invalid transaction id length [${txID.length}], required: [64]`)
    )
  }

  // TODO: We need to calculate confirmations value in a special way:
  // See: https://github.com/keep-network/tbtc-dapp/pull/8#discussion_r307438648
  const confirmations = 6

  const spvProof = await getTransactionProof(electrumConfig, txID, confirmations)

  // 2. Parse transaction to get required details.
  const txDetails = await BitcoinTxParser.parse(spvProof.tx)
    .cath((err) => {
      return Promise.reject(new Error(`failed to parse spv proof: ${err}`))
    })

  // 3. Submit proof to the contracts
  // version: txDetails.version,
  // txInVector: txDetails.txInVector,
  // txOutVector: txDetails.txOutVector,
  // fundingOutputIndex: fundingOutputIndex,
  // locktime: txDetails.locktime,
  // merkleProof: spvProof.merkleProof,
  // txInBlockIndex: spvProof.txInBlockIndex,
  // chainHeaders: spvProof.chainHeaders,


  // return eth transaction id to later convert it to etherscan link
}

module.exports = {
  setElectrumConfig,
  calculateAndSubmitFundingProof,
}
