import { Deposit } from './eth/contracts'
import { BitcoinTxParser } from 'tbtc-helpers'

const bitcoinspv = require('tbtc-helpers').BitcoinSPV

/**
 * @typedef {Object} Proof
 * @property {string} tx - Raw transaction in hexadecimal format.
 * @property {string} merkleProof - Transaction merkle proof.
 * @property {string} txInBlockIndex - Transaction index in a block.
 * @property {string} chainHeaders - Chain of blocks headers.
 */

/**
 * Gets transaction SPV proof from BitcoinSPV.
 * @param {ElectrumClient} electrumClient Electrum client instance.
 * @param {string} txID Transaction ID.
 * @param {number} confirmations Required number of confirmations.
 * @return {Proof} Transaction's SPV proof.
 */
export async function getTransactionProof(electrumClient, txID, confirmations) {
  const bitcoinSPV = new bitcoinspv.BitcoinSPV(electrumClient)

  const spvProof = await bitcoinSPV.getTransactionProof(txID, confirmations)
    .catch((err) => {
      throw new Error(`failed to get bitcoin spv proof: ${err}`)
    })

  return {
    tx: spvProof.tx,
    merkleProof: spvProof.merkleProof,
    txInBlockIndex: spvProof.txInBlockIndex,
    chainHeaders: spvProof.chainHeaders,
  }
}

/**
 * Calculates deposit funding proof and submits it to tBTC.
 * @param {string} depositAddress Deposit contract address.
 * @param {Proof} spvProof Transaction's SPV proof.
 * @param {number} fundingOutputIndex Position of a funding output in the transaction.
 * @return {string} ID of transaction submitting the proof to the deposit contract.
 */
export async function submitFundingProof(
  depositAddress,
  spvProof,
  fundingOutputIndex
) {
  // Parse transaction to get required details.
  let txDetails
  try {
    txDetails = await BitcoinTxParser.parse(spvProof.tx)
  } catch (err) {
    throw new Error(`failed to parse spv proof: [${err}]`)
  }

  // Submit funding proof to the deposit contract.
  const deposit = await Deposit.at(depositAddress)

  const result = await deposit.provideBTCFundingProof(
    Buffer.from(txDetails.version, 'hex'),
    Buffer.from(txDetails.txInVector, 'hex'),
    Buffer.from(txDetails.txOutVector, 'hex'),
    Buffer.from(txDetails.locktime, 'hex'),
    fundingOutputIndex,
    Buffer.from(spvProof.merkleProof, 'hex'),
    spvProof.txInBlockIndex,
    Buffer.from(spvProof.chainHeaders, 'hex')
  ).catch((err) => {
    throw new Error(`failed to submit funding transaction proof: [${err}]`)
  })

  return result.tx
}
