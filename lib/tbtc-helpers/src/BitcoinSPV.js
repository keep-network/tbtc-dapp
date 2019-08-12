// JS implementation of merkle.py script from [summa-tx/bitcoin-spv] repository.
//
// [summa-tx/bitcoin-spv]: https://github.com/summa-tx/bitcoin-spv/
const Hash256 = require('bcrypto/lib/hash256')
const Merkle = require('bcrypto/lib/merkle')

/**
 * @typedef {Object} Proof
 * @property {string} tx - Raw transaction in hexadecimal format.
 * @property {string} merkleProof - Transaction merkle proof.
 * @property {string} txInBlockIndex - Transaction index in a block.
 * @property {string} chainHeaders - Chain of blocks headers.
 */

class BitcoinSPV {
  /**
   * Initialize Bitcoin SPV with provided Electrum Client.
   * @param {ElectrumClient} electrumClient
   */
  constructor(electrumClient) {
    this.client = electrumClient
  }

  /**
   * Get SPV transaction proof.
   * @param {string} txHash Transaction hash.
   * @param {number} confirmations Required number of confirmations for the transaction.
   * @return {Proof} Transaction's SPV proof.
   */
  async getTransactionProof(txHash, confirmations) {
    // CONNECT TO ELECTRUM SERVER
    await this.client.connect()
      .catch((err) => {
        throw new Error(`failed to connect to electrum server: [${err}]`)
      })

    // GET TRANSACTION
    const tx = await this.client.getTransaction(txHash)
      .catch((err) => {
        this.client.close()
        throw new Error(`failed to get transaction: [${err}]`)
      })

    if (tx.confirmations < confirmations) {
      this.client.close()
      throw new Error(`transaction confirmations number [${tx.confirmations}] is not enough, required [${confirmations}]`)
    }

    const latestBlockHeight = await this.client.latestBlockHeight()
      .catch((err) => {
        this.client.close()
        throw new Error(`failed to get latest block height: [${err}]`)
      })

    const txBlockHeight = latestBlockHeight - tx.confirmations + 1

    // GET HEADER CHAIN
    const headersChain = await this.client.getHeadersChain(txBlockHeight, confirmations)
      .catch((err) => {
        this.client.close()
        throw new Error(`failed to get headers chain: [${err}]`)
      })

    // GET MERKLE PROOF
    const merkleProof = await this.client.getMerkleProof(txHash, txBlockHeight)
      .catch((err) => {
        this.client.close()
        throw new Error(`failed to get merkle proof: [${err}]`)
      })

    // DISCONNECT FROM ELECTRUM SERVER
    await this.client.close()
      .catch((err) => {
        throw new Error(`failed to close connection to electrum server: [${err}]`)
      })

    // VERIFY MERKLE PROOF
    if (!this.verifyMerkleProof(merkleProof.proof, merkleProof.position)) {
      throw new Error('invalid merkle proof')
    }

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
  verifyMerkleProof(proofHex, index) {
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
    const expectedRoot = Merkle.deriveRoot(Hash256, transactionHash, branches, index - 1)

    // Validate if calculated root expects the one provided in the proof.
    if (actualRoot.equals(expectedRoot)) {
      return true
    } else {
      return false
    }
  }
}

module.exports = {
  BitcoinSPV,
}
