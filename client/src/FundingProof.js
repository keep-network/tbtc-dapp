import { Deposit } from './eth/contracts'
import { BitcoinTxParser } from 'tbtc-helpers'

const bitcoinspv = require('tbtc-helpers').BitcoinSPV

/**
 * Gets transaction SPV proof from BitcoinSPV.
 * @param {ElectrumClient} electrumClient Electrum client instance.
 * @param {string} txID Transaction ID
 * @param {number} confirmations Required number of confirmations
 */
async function getTransactionProof(electrumClient, txID, confirmations) {
  const bitcoinSPV = new bitcoinspv.BitcoinSPV(electrumClient)

  const spvProof = await bitcoinSPV.getTransactionProof(txID, confirmations)
    .catch((err) => {
      throw new Error(`failed to get bitcoin spv proof: ${err}`)
    })

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
export async function calculateAndSubmitFundingProof(
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
  // TODO: Original value `6` was decreased to `1` for demo simplification. Set it
  // back to `6`.
  const confirmations = 1

  // Get transaction SPV proof.
  const spvProof = await getTransactionProof(electrumClient, txID, confirmations)

  // Parse transaction to get required details.
  const txDetails = await BitcoinTxParser.parse(spvProof.tx)
    .catch((err) => {
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
