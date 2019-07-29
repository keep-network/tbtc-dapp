const electrumjs = require('electrumjs')

function Config(server, port, protocol) {
  this.server = server
  this.port = port
  this.protocol = protocol
}

class Client {
  constructor(config) {
    this.electrumClient = new electrumjs.ElectrumClient(config.server, config.port, config.protocol)
  }

  async connect() {
    try {
      await this.electrumClient.connect()

      const banner = await this.electrumClient.methods.server_banner()
      console.log(banner)
    } catch (err) {
      return Promise.reject(new Error(`failed to connect to electrum server: [${err}]`))
    }
  }

  async close() {
    this.electrumClient._socketClient.close()
  }

  async latestBlockHeight() {
    const header = await this.electrumClient.methods.blockchain_headers_subscribe()
      .catch((err) => {
        return Promise.reject(new Error(JSON.stringify(err)))
      })
    return header.height
  }

  async getTransaction(txHash) {
    const tx = await this.electrumClient.methods.blockchain_transaction_get(txHash, true)
      .catch((err) => {
        return Promise.reject(new Error(JSON.stringify(err)))
      })

    return tx
  }

  async getMerkleRoot(blockHeight) {
    const header = await this.electrumClient.methods.blockchain_block_header(blockHeight)
      .catch((err) => {
        return Promise.reject(new Error(JSON.stringify(err)))
      })

    return fromHex(header).slice(36, 68)
  }

  async getHeadersChain(blockHeight, confirmations) {
    const headersChain = await this.electrumClient.methods.blockchain_block_headers(blockHeight, confirmations + 1)
      .catch((err) => {
        return Promise.reject(new Error(JSON.stringify(err)))
      })
    return headersChain.hex
  }

  async getMerkleProof(txHash, blockHeight) {
    const merkle = await this.electrumClient.methods.blockchain_transaction_getMerkle(txHash, blockHeight)
      .catch((err) => {
        return Promise.reject(new Error(JSON.stringify(err)))
      })

    const position = merkle.pos + 1 // add 1 because proof uses 1-indexed positions

    // Transaction hash
    let proof = fromHex(txHash).reverse()

    // Merkle tree
    merkle.merkle.forEach(function(item) {
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
