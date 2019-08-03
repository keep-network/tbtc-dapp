const electrumjs = require('electrumjs')
const Sha256 = require('bcrypto/lib/sha256')

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

      // Negotiate protocol version.
      await this.electrumClient.methods.server_version('tbtc', '1.4.2')
    } catch (err) {
      return new Error(`failed to connect to electrum server: [${err}]`)
    }
  }

  /**
  * Disconnect from the server.
  */
  async close() {
    await this.electrumClient._socketClient.close()
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
   * Get unspent outputs sent to a script.
   * @param {string} script ScriptPubKey in a hexadecimal format.
   * @return {*} List of unspent outputs. It includes transactions in the mempool.
   */
  async getUnspentToScript(script) {
    const scriptHash = scriptToHash(script)

    const listUnspent = await this.electrumClient.methods.blockchain_scripthash_listunspent(scriptHash)
      .catch((err) => {
        throw new Error(JSON.stringify(err))
      })

    return listUnspent
  }

  /**
   * Waits for a transaction sent to a script. It includes transactions in the mempool.
   * @param {string} script ScriptPubKey in a hexadecimal format.
   * @param {function} callback Is a callback function called when an existing
   * transaction for the script is found or a new transaction is sent to the script.
   * It passes [status]([Electrum Protocol](https://electrumx.readthedocs.io/en/latest/protocol-basics.html#status))
   * of the transaction to the callback.
   * @return {any} Value resolved by the callback.
   */
  async onTransactionToScript(script, callback) {
    const scriptHash = scriptToHash(script)

    // Check if transaction for script already exists.
    const initialStatus = await this.electrumClient.methods.blockchain_scripthash_subscribe(scriptHash)
      .catch((err) => {
        throw new Error(`failed to subscribe: ${err}`)
      })

    // Invoke callback for the current status.
    const result = await callback(initialStatus)
    if (result) {
      // TODO: We send request directly, because `electrumjs` library doesn't
      // support `blockchain.scripthash.unsubscribe` method.
      await this.electrumClient.methods.client.request('blockchain.scripthash.unsubscribe', [scriptHash])
        .catch((err) => {
          throw new Error(`failed to unsubscribe: ${err}`)
        })

      return result
    }

    // If callback have not resolved wait for new transaction notifications.
    return new Promise(async (resolve, reject) => {
      try {
        const eventName = 'blockchain.scripthash.subscribe'
        const electrumClient = this.electrumClient

        const listener = async function listener(msg) {
          const receivedScriptHash = msg[0]
          const status = msg[1]

          console.log(
            `Received notification for script hash: [${receivedScriptHash}] with status: [${status}]`
          )

          if (receivedScriptHash == scriptHash) {
            const result = await callback(status)
            if (result) {
              await electrumClient.events.off(eventName, listener)

              // TODO: We send request directly, because `electrumjs` library doesn't
              // support `blockchain.scripthash.unsubscribe` method.
              await electrumClient.methods.client.request('blockchain.scripthash.unsubscribe', [scriptHash])
                .catch((err) => {
                  return reject(new Error(`failed to unsubscribe: ${err}`))
                })

              return resolve(result)
            }
          }
        }

        this.electrumClient.events.on(eventName, listener)
      } catch (err) {
        return reject(new Error(`failed listening for notification: ${err}`))
      }
    })
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

/**
 * Converts ScriptPubKey to a script hash specified by the [Electrum Protocol](https://electrumx.readthedocs.io/en/latest/protocol-basics.html#script-hashes).
 * @param {string} script ScriptPubKey in a hexadecimal format.
 * @return {string} Script hash.
 */
function scriptToHash(script) {
  const scriptHash = Sha256.digest(fromHex(script)).reverse()
  return toHex(scriptHash)
}

module.exports = {
  Config, Client, scriptToHash,
}
