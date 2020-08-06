import Common from 'ethereumjs-common'
import { Transaction } from 'ethereumjs-tx'
import { getNetworkIdFromArtifact } from '@keep-network/tbtc.js'
import config from './config.json'

/**
 * Builds a Transaction object for a custom chain.
 * @param {*} txData The transaction data
 * @param {number} chainId The custom chain's ID.
 * @return {Transaction} The Ethereum transaction
 */
export const buildTransactionForChain = (txData, chainId) => {
  const common = Common.forCustomChain(
      'mainnet',
      {
          name: 'keep-dev',
          chainId: chainId,
      },
      'petersburg', ['petersburg']
    )
  return new Transaction(txData, { common })
}

/**
 * Gets the `chainId` from a signed `v`.
 * @param {string} v Hex string for `v` 
 */
export const getChainIdFromSignedV = (v) => {
  // After a transaction is signed, the `v` component of the signature (v,r,s)
  // is set according to this algorithm, specified in EIP155 [1]:
  // v = CHAIN_ID * 2 + 35
  // Reformulating, we can calculate `chainId`:
  // CHAIN_ID = (v - 35) / 2
  // [1] https://github.com/ethereum/EIPs/blob/master/EIPS/eip-155.md
  v = parseInt(v, 16)
  const chainId = Math.floor((v - 35) / 2)
  return chainId < 0 ? 0 : chainId
}

/**
 * Pads a hex string with zeroes, and returns a buffer.
 * @param {string} hexString The hex string, with/without the 0x prefix.
 * @param {number} padLength Length to pad string to, in bytes.
 * @return {Buffer} The padded hex as a Buffer.
 */
export function hexToPaddedBuffer(hexString, padLength) {
  hexString = hexString.startsWith('0x') ? hexString.slice(2) : hexString
  hexString = hexString.padStart(padLength, '0')
  return new Buffer(hexString, 'hex')
}

export const getChainId = () => {
  if (process.env.NODE_ENV === "development") {
    // private chains (default), change if you use a different one
    return 1337
  }
  // For KEEP internal testnet, ropsten and mainnet `chainId == networkId`
  return Number(getNetworkIdFromArtifact())
}

export const getWsUrl = () => {
  if (process.env.NODE_ENV === "development") {
    // Ganache web socket url, change if you use a different one
    return "ws://localhost:8545"
  }
  return config[getChainId()].wsURL
}
