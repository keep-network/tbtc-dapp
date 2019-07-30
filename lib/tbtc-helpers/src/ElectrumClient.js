const electrumjs = require('electrumjs')

function Config(server, port, protocol) {
  this.server = server
  this.port = port
  this.protocol = protocol
}

/**
 * Client to interact with [ElectrumX](https://electrumx.readthedocs.io/en/latest/index.html)
 * server.
 * Uses methods exposed by the [Electrum Protocol](https://electrumx.readthedocs.io/en/latest/protocol.html)
 */
class Client {
  constructor(config) {
    this.electrumClient = new electrumjs.ElectrumClient(config.server, config.port, config.protocol)
  }

  /**
   * Establish connection with the server.
   */
  async connect() {
    try {
      await this.electrumClient.connect()

      const banner = await this.electrumClient.methods.server_banner()
      console.log(banner)
    } catch (err) {
      return Promise.reject(new Error(`failed to connect to electrum server: [${err}]`))
    }
  }

  /**
  * Disconnect form the server.
  */
  async close() {
    this.electrumClient._socketClient.close()
  }

  /**
   * Get height of the latest mined block.
   * @return {number} Height of the last mined block.
   */
  async latestBlockHeight() {
    // Get header of the latest mined block.
    const header = await this.electrumClient.methods.blockchain_headers_subscribe()
      .catch((err) => {
        return Promise.reject(new Error(JSON.stringify(err)))
      })
    return header.height
  }

  /**
   * Get details of the transaction.
   * @param {string} txHash Hash of a transaction.
   * @return {*} Transaction details.
   */
  async getTransaction(txHash) {
    const tx = await this.electrumClient.methods.blockchain_transaction_get(txHash, true)
      .catch((err) => {
        return Promise.reject(new Error(JSON.stringify(err)))
      })

    return tx
  }

  /**
   * Get merkle root hash for block.
   * @param {number} blockHeight Block height.
   * @return {string} Merkle root hash.
   */
  async getMerkleRoot(blockHeight) {
    const header = await this.electrumClient.methods.blockchain_block_header(blockHeight)
      .catch((err) => {
        return Promise.reject(new Error(JSON.stringify(err)))
      })

    return fromHex(header).slice(36, 68)
  }

  /**
   * Get concatenated chunk of block headers built on a starting block.
   * @param {number} blockHeight Starting block height.
   * @param {number} confirmations Number of confirmations (subsequent blocks)
   * built on the starting block.
   * @return {string} Concatenation of block headers in a hexadecimal format.
   */
  async getHeadersChain(blockHeight, confirmations) {
    const headersChain = await this.electrumClient.methods.blockchain_block_headers(blockHeight, confirmations + 1)
      .catch((err) => {
        return Promise.reject(new Error(JSON.stringify(err)))
      })
    return headersChain.hex
  }

  /**
   * Get proof of transaction inclusion in the block. It produces proof as a
   * concatenation of 32-byte values in a hexadecimal form, in the following
   * order: transaction hash, merkle tree branch to transaction, merkle tree root
   * @param {string} txHash Hash of a transaction.
   * @param {number} blockHeight Height of the block where transaction was confirmed.
   * @return {string} Transaction inclusion proof in hexadecimal form.
   */
  async getMerkleProof(txHash, blockHeight) {
    const merkle = await this.electrumClient.methods.blockchain_transaction_getMerkle(txHash, blockHeight)
      .catch((err) => {
        return Promise.reject(new Error(JSON.stringify(err)))
      })

    const position = merkle.pos + 1 // add 1 because proof uses 1-indexed positions

    // Transaction hash
    let proof = fromHex(txHash).reverse()

    // Merkle tree
    merkle.merkle.forEach(function (item) {
      proof = Buffer.concat([proof, fromHex(item).reverse()])
    })

    // Merkle root
    const merkleRoot = await this.getMerkleRoot(blockHeight)
      .catch((err) => {
        return Promise.reject(new Error(JSON.stringify(err)))
      })

    proof = Buffer.concat([proof, fromHex(merkleRoot)])

    return { proof: toHex(proof), position: position }
  }

  /**
   * Finds index of output in a transaction for a given address.
   * @param {string} txHash Hash of a transaction.
   * @param {string} address Bitcoin address for the output.
   * @return {number} Index of output in the transaction (0-indexed).
   */
  async findOutputForAddress(txHash, address) {
    const tx = await this.getTransaction(txHash)
      .catch((err) => {
        return Promise.reject(new Error(JSON.stringify(err)))
      })

    const outputs = tx.vout

    for (let index = 0; index < outputs.length; index++) {
      for (const a of outputs[index].scriptPubKey.addresses) {
        if (a == address) {
          return (index)
        }
      }
    }

    return Promise.reject(new Error(`output for address ${address} not found`))
  }
}

function fromHex(hex) {
  return Buffer.from(hex, 'hex')
}

function toHex(bytes) {
  return Buffer.from(bytes).toString('hex')
}

module.exports = {
  Config, Client,
}
