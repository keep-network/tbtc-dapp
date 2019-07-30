// JS implementation of merkle.py script from [summa-tx/bitcoin-spv] repository.
//
// [summa-tx/bitcoin-spv]: https://github.com/summa-tx/bitcoin-spv/
const Hash256 = require('bcrypto/lib/hash256')
const Merkle = require('bcrypto/lib/merkle')
const ElectrumClient = require('./ElectrumClient')

let client

/**
 * Initialize Bitcoin SPV. Connect to electrum server.
 * @param {ElectrumClient.Config} electrumConfig Connection details of electrum
 * server.
 */
async function initialize(electrumConfig) {
  client = new ElectrumClient.Client(electrumConfig)

  await client.connect()
}

/**
 * Closes connection to electrum client.
 */
function close() {
  client.close()
}

/**
 * @typedef {Object} Proof
 * @property {string} tx - Transaction hash
 * @property {string} merkleProof- Transaction merkle proof
 * @property {string} txInBlockIndex - Transaction index in a block
 * @property {string} chainHeaders - Chain of blocks headers
 */

/**
 * Get SPV transaction proof.
 * @param {string} txHash Transaction hash.
 * @param {number} confirmations Required number of confirmations for the transaction.
 * @return {Proof} Transaction's SPV proof.
 */
async function getTransactionProof(txHash, confirmations) {
  // GET TRANSACTION
  const tx = await client.getTransaction(txHash)
    .catch((err) => {
      return Promise.reject(new Error(`failed to get transaction: [${err}]`))
    })

  if (tx.confirmations < confirmations) {
    return Promise.reject(new Error(`transaction confirmations number [${tx.confirmations}] is not enough, required [${confirmations}]`))
  }

  const latestBlockHeight = await client.latestBlockHeight()
    .catch((err) => {
      return Promise.reject(new Error(`failed to get latest block height: [${err}]`))
    })

  const txBlockHeight = latestBlockHeight - tx.confirmations + 1

  // GET HEADER CHAIN
  const headersChain = await client.getHeadersChain(txBlockHeight, confirmations)
    .catch((err) => {
      return Promise.reject(new Error(`failed to get headers chain: [${err}]`))
    })

  // GET MERKLE PROOF
  const merkleProof = await client.getMerkleProof(txHash, txBlockHeight)
    .catch((err) => {
      return Promise.reject(new Error(`failed to get merkle proof: [${err}]`))
    })

  // VERIFY MERKLE PROOF
  if (!verifyMerkleProof(merkleProof.proof, merkleProof.position)) {
    return Promise.reject(new Error('invalid merkle proof'))
  }

  close()

  return {
    tx: tx.hex,
    merkleProof: merkleProof.proof,
    txInBlockIndex: merkleProof.position,
    chainHeaders: headersChain,
  }
}

/**
 * Verifies merkle proof of transaction inclusion in the block. It expects proof
 * as a concatenation of 32-byte values in a hexadecimal form, in the following
 * order: transaction hash, n merkle tree branches, merkle tree root
 * @param {string} proofHex hexadecimal representation of the proof
 * @param {number} index is transaction index in the block (1-indexed)
 * @return {boolean} true if verification passed, else false
 */
function verifyMerkleProof(proofHex, index) {
  const proof = Buffer.from(proofHex, 'hex')

  // Extract merkle tree root.
  const actualRoot = proof.slice(proof.length - 32, proof.length)

  // Extract transaction hash.
  const transactionHash = proof.slice(0, 32)

  // Extract tree branches
  const branches = []

  for (let i = 1; i < (Math.floor(proof.length / 32) - 1); i++) {
    const branch = proof.slice(i * 32, (i + 1) * 32)
    branches.push(branch)
  }

  // Derive expected root from branches and transaction.
  // We need to subtract 1 from the index, because bcrypto library expects 0-indexed
  // value.
  expectedRoot = Merkle.deriveRoot(Hash256, transactionHash, branches, index - 1)

  // Validate if calculated root expects the one provided in the proof.
  if (actualRoot.equals(expectedRoot)) {
    return true
  } else {
    return false
  }
}

module.exports = {
  initialize, close, getTransactionProof, verifyMerkleProof,
}
