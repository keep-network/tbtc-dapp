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
