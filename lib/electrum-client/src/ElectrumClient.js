const ElectrumCli = require('electrum-client')

module.exports = class ElectrumClient {
  constructor(server, port, protocol) {
    this.client = new ElectrumCli(port, server, protocol)
  }

  async connect() {
    try {
      await this.client.connect()

      const banner = await this.client.server_banner()
      console.log(banner)
    } catch (err) {
      return Promise.reject(new Error(`failed to connect to electrum server: [${err}]`))
    }
  }

  async close() {
    this.client.close()
  }

  async latestBlockHeight() {
    const header = await this.client.blockchainHeaders_subscribe()
      .catch((err) => {
        return Promise.reject(new Error(JSON.stringify(err)))
      })
    return header.height
  }

  async getTransaction(txHash) {
    const tx = await this.client.blockchainTransaction_get(txHash, true)

    return tx
  }

  async getMerkleRoot(blockHeight) {
    const header = await this.client.blockchainBlock_header(blockHeight)
      .catch((err) => {
        return Promise.reject(new Error(JSON.stringify(err)))
      })

    return fromHex(header).slice(36, 68)
  }

  async getHeadersChain(blockHeight, confirmations) {
    const headersChain = await this.client.blockchainBlock_headers(blockHeight, confirmations + 1)
      .catch((err) => {
        return Promise.reject(new Error(JSON.stringify(err)))
      })
    return headersChain.hex
  }

  async getMerkleProof(txHash, blockHeight) {
    const merkle = await this.client.blockchainTransaction_getMerkle(txHash, blockHeight)
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

    return new Promise((resolve, reject) => {
      const outputs = tx.vout
      outputs.forEach((output, index) => {
        output.scriptPubKey.addresses.forEach((a) => {
          if (a == address) {
            resolve(index)
          }
        })
      })
      reject(new Error(`output for address ${address} not found`))
    })
  }

  watchHeaders() {
    // TODO: Leaving this snippet for later to find the example easily
    //
    // client.subscribe.on('blockchain.headers.subscribe', (v) => {
    //   console.log('emitted', v)
    // }) // subscribe message(EventEmitter)
  }
}

function fromHex(hex) {
  return Buffer.from(hex, 'hex')
}

function toHex(bytes) {
  return Buffer.from(bytes).toString('hex')
}
