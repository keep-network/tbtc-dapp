const electrumjs = require('electrumjs')

/**
 * Configuration of electrum client.
 * @typedef Config
 * @type {Object}
 * @property {string} server ElectrumX server hostname.
 * @property {number} port ElectrumX server port.
 * @property {string} protocol ElectrumX server connection protocol (`ssl`|`tls`).
*/

/**
 * Configuration of electrum client.
 * @param {string} server ElectrumX server hostname.
 * @param {number} port ElectrumX server port.
 * @param {string} protocol ElectrumX server connection protocol (`ssl`|`tls`).
 */
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
  /**
   * Initializes Electrum Client instance with provided configuration.
   * @param {Config} config Electrum client connection configuration.
   */
  constructor(config) {
    this.electrumClient = new electrumjs.ElectrumClient(
      config.server,
      config.port,
      config.protocol
    )
    this.closed = true
  }

  /**
   * Establish connection with the server.
   */
  async connect() {
    console.log('Connecting to electrum server...')
    try {
      await this.electrumClient.connect()

      const banner = await this.electrumClient.methods.server_banner()
      console.log(banner)
    } catch (err) {
      throw new Error(`failed to connect to electrum server: [${err}]`)
    }

    this.closed = false

    this.keepAlive()
  }

  /**
   * Ping the server to ensure it is responding, and to keep the session alive.
   * The server may disconnect clients that have sent no requests for roughly 10
   * minutes. It sends a ping request every 2 minutes. If the request fails it
   * logs an error and closes the connection.
   */
  async keepAlive() {
    if (!this.closed) {
      this.keepAliveHandle = setInterval(
        async (client) => {
          await client.electrumClient.methods.server_ping()
            .catch((err) => {
              console.error(`ping to server failed: [${err}]`)
              client.close() // TODO: we should reconnect
            })
        },
        120 * 1000, // every two minutes
        this // pass this context as an argument to function
      )
    }
  }

  /**
  * Disconnect form the server.
  */
  async close() {
    console.log('Closing connection to electrum server...')

    if (this.closed) {
      console.log('Connection already closed.')
    } else {
      this.closed = true

      clearInterval(this.keepAliveHandle)

      this.electrumClient._socketClient.close()
    }
  }

  /**
   * Get height of the latest mined block.
   * @return {number} Height of the last mined block.
   */
  async latestBlockHeight() {
    // Get header of the latest mined block.
    const header = await this.electrumClient.methods.blockchain_headers_subscribe()
      .catch((err) => {
        throw new Error(`failed to get block header: [${err}]`)
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
        throw new Error(`failed to get transaction: [${err}]`)
      })

    return tx
  }

  /**
   * Calls a callback for the current block and next mined blocks until the
   * callback returns a truthy value.
   * @param {function} callback Callback function called for the current block
   * and when a new block is mined. It passes to the callback a value returned by
   * [blockchain.headers.subscribe](https://electrumx.readthedocs.io/en/latest/protocol-methods.html#blockchain-headers-subscribe).
   * @return {any} Value resolved by the callback.
   */
  async onNewBlock(callback) {
    // Subscribe for new block notifications.
    const blockHeader = await this.electrumClient.methods.blockchain_headers_subscribe()
      .catch((err) => {
        throw new Error(`failed to subscribe: ${err}`)
      })

    // Invoke callback for the current block.
    const result = await callback(blockHeader)
    if (result) {
      return result
    }

    // If callback have not resolved wait for new blocks notifications.
    return new Promise(async (resolve) => {
      try {
        const eventName = 'blockchain.headers.subscribe'
        const electrumClient = this.electrumClient

        const listener = async function(messages) {
          for (const msg of messages) {
            const height = msg.height

            console.log(
              `Received notification of a new block at height: [${height}]`
            )

            // Invoke callback for the current block.
            const result = await callback(msg)
            if (result) {
              await electrumClient.events.off(eventName, listener)

              return resolve(result)
            }
          }
        }

        this.electrumClient.events.on(eventName, listener)

        console.log(`Registered listener for ${eventName} event`)
      } catch (err) {
        throw new Error(`failed listening for notification: ${err}`)
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
        throw new Error(`failed to get block header: [${err}]`)
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
        throw new Error(`failed to get block headers: [${err}]`)
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
        throw new Error(`failed to get transaction merkle: [${err}]`)
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
        throw new Error(`failed to get merkle root: [${err}]`)
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
        throw new Error(`failed to get transaction: [${err}]`)
      })

    const outputs = tx.vout

    for (let index = 0; index < outputs.length; index++) {
      for (const a of outputs[index].scriptPubKey.addresses) {
        if (a == address) {
          return (index)
        }
      }
    }

    throw new Error(`output for address ${address} not found`)
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
