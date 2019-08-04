import { Deposit } from './eth/contracts'

const BitcoinTxParser = require('tbtc-helpers').BitcoinTxParser
const bitcoinSPV = require('tbtc-helpers').BitcoinSPV
const ElectrumClient = require('tbtc-helpers').ElectrumClient

const fs = require('fs')

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

const electrumConfig = readElectrumConfig(process.env.CONFIG_FILE)

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
 * @param {ElectrumClient} electrumClient Electrum client instance.
 * @param {string} depositAddress Deposit contract address.
 * @param {string} txID Funding transaction ID.
 * @param {number} fundingOutputIndex Position of a funding output in the transaction.
 * @return {string} ID of transaction submitting the proof to the deposit contract.
 */
async function calculateAndSubmitFundingProof(
  electrumClient,
  depositAddress,
  txID,
  fundingOutputIndex
) {
  if (txID.length != 64) {
    throw new Error(`invalid transaction id length [${txID.length}], required: [64]`)
  }

  // TODO: We need to calculate confirmations value in a special way:
  // See: https://github.com/keep-network/tbtc-dapp/pull/8#discussion_r307438648
  const confirmations = 1

  // Get transaction SPV proof.
  const spvProof = await getTransactionProof(electrumClient, txID, confirmations)

  // Parse transaction to get required details.
  const txDetails = await BitcoinTxParser.parse(spvProof.tx)
    .cath((err) => {
      throw new Error(`failed to parse spv proof: [${err}]`)
    })

  // Submit funding proof to the deposit contract.
  const deposit = await Deposit.at(depositAddress)

  const result = await deposit.provideBTCFundingProof(
    txDetails.version,
    txDetails.txInVector,
    txDetails.txOutVector,
    txDetails.locktime,
    fundingOutputIndex,
    spvProof.merkleProof,
    spvProof.txInBlockIndex,
    spvProof.chainHeaders
  ).catch((err) => {
    throw new Error(`failed to submit funding transaction proof: [${err}]`)
  })

  return result.tx
}

module.exports = {
  calculateAndSubmitFundingProof,
}
