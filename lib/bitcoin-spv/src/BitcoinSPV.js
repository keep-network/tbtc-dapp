// JS implementation of merkle.py script from [summa-tx/bitcoin-spv] repository.
//
// [summa-tx/bitcoin-spv]: https://github.com/summa-tx/bitcoin-spv/
const ProofVerification = require('./ProofVerification')

class BitcoinSPV {
  async initialize(electrumClient) {
    this.electrumClient = electrumClient

    await this.electrumClient.connect()
  }

  close() {
    this.electrumClient.close()
  }

  async getProof(txHash, confirmations) {
    // GET TRANSACTION
    const tx = await this.electrumClient.getTransaction(txHash)
      .catch((err) => {
        return Promise.reject(new Error(`failed to get transaction: [${err}]`))
      })

    if (tx.confirmations < confirmations) {
      return Promise.reject(new Error(`transaction confirmations number [${tx.confirmations}] is not enough, required [${confirmations}]`))
    }

    const latestBlockHeight = await this.electrumClient.latestBlockHeight()
      .catch((err) => {
        return Promise.reject(new Error(`failed to get latest block height: [${err}]`))
      })

    const txBlockHeight = latestBlockHeight - tx.confirmations + 1

    // GET HEADER CHAIN
    const headersChain = await this.electrumClient.getHeadersChain(txBlockHeight, confirmations)
      .catch((err) => {
        return Promise.reject(new Error(`failed to get headers chain: [${err}]`))
      })

    // GET MERKLE PROOF
    const merkleProof = await this.electrumClient.getMerkleProof(txHash, txBlockHeight)
      .catch((err) => {
        return Promise.reject(new Error(`failed to get merkle proof: [${err}]`))
      })

    // VERIFY PROOF
    if (!ProofVerification.verify(merkleProof.proof, merkleProof.position)) {
      return Promise.reject(new Error('invalid merkle proof'))
    }

    this.close()

    return Promise.resolve({
      tx: tx.hex,
      merkleProof: merkleProof.proof,
      txInBlockIndex: merkleProof.position,
      chainHeaders: headersChain,
    })
  }
}

module.exports = BitcoinSPV
