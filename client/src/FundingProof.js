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
 * @param {string} txID Funding transaction ID.
 * @param {number} fundingOutputIndex Position of a funding output in the transaction.
 */
export async function calculateAndSubmitFundingProof(electrumClient, txID, fundingOutputIndex) {
  if (txID.length != 64) {
    throw new Error(`invalid transaction id length [${txID.length}], required: [64]`)
  }

  // TODO: We need to calculate confirmations value in a special way:
  // See: https://github.com/keep-network/tbtc-dapp/pull/8#discussion_r307438648
  const confirmations = 6

  const spvProof = await getTransactionProof(electrumClient, txID, confirmations)

  // 2. Parse transaction to get required details.
  const txDetails = await BitcoinTxParser.parse(spvProof.tx)
    .catch((err) => {
      throw new Error(`failed to parse spv proof: ${err}`)
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