import { LedgerSubprovider as LedgerSubprovider0x } from "@0x/subproviders/lib/src/subproviders/ledger" // https://github.com/0xProject/0x-monorepo/issues/1400
import web3Utils from "web3-utils"
import { hexToPaddedBuffer, buildTransactionForChain } from "./utils"

export const LEDGER_DERIVATION_PATHS = {
  LEDGER_LIVE: `m/44'/60'/x'/0/0`,
  LEDGER_LEGACY: `m/44'/60'/0'/x`,
}

/**
 * A custom Ledger subprovider, inheriting from the 0x Subprovider.
 *
 * Supports chains with a chainId > 255, and mitigates some issues with the
 * LedgerJS library.
 */
class LedgerSubprovider extends LedgerSubprovider0x {
  chainId
  addressToPathMap = {}
  pathToAddressMap = {}

  constructor(config) {
    super(config)
    this.chainId = config.chainId
  }

  async getAccountsAsync(numberOfAccounts, accountsOffSet = 0) {
    const addresses = []
    for (
      let index = accountsOffSet;
      index < numberOfAccounts + accountsOffSet;
      index++
    ) {
      const address = await this.getAddress(index)
      addresses.push(address)
    }

    return addresses
  }

  async getAddress(index) {
    const path = this._baseDerivationPath.replace("x", index)

    let ledgerResponse
    try {
      this._ledgerClientIfExists = await this._createLedgerClientAsync()
      ledgerResponse = await this._ledgerClientIfExists.getAddress(
        path,
        this._shouldAlwaysAskForConfirmation,
        true
      )
    } finally {
      await this._destroyLedgerClientAsync()
    }

    const address = web3Utils.toChecksumAddress(ledgerResponse.address)

    this.addressToPathMap[address] = path
    this.pathToAddressMap[path] = address

    return address
  }

  async signTransactionAsync(txParams) {
    LedgerSubprovider._validateTxParams(txParams)
    if (txParams.from === undefined || !web3Utils.isAddress(txParams.from)) {
      throw new Error("Invalid address")
    }

    const fullDerivationPath = this.addressToPathMap[
      web3Utils.toChecksumAddress(txParams.from)
    ]

    this._ledgerClientIfExists = await this._createLedgerClientAsync()

    try {
      const tx = buildTransactionForChain(txParams, this.chainId)

      // Set the EIP155 bits
      const vIndex = 6
      tx.raw[vIndex] = hexToPaddedBuffer(this.chainId.toString(16), 4) // v
      const rIndex = 7
      tx.raw[rIndex] = Buffer.from([]) // r
      const sIndex = 8
      tx.raw[sIndex] = Buffer.from([]) // s

      const response = await this._ledgerClientIfExists.signTransaction(
        fullDerivationPath,
        tx.serialize().toString("hex")
      )

      const ledgerSignedV = parseInt(response.v, 16)

      // Recompute `v` according to the algorithm detailed in EIP155 [1].
      // [1] https://github.com/ethereum/EIPs/blob/master/EIPS/eip-155.md
      const eip155Constant = 35
      let signedV = this.chainId * 2 + eip155Constant
      if (ledgerSignedV % 2 === 0) {
        signedV += 1
      }

      // Verify signature `v` value returned from Ledger.
      if (signedV !== ledgerSignedV) {
        throw new Error("Invalid chainID")
      }

      // Store signature in transaction.
      tx.v = hexToPaddedBuffer(signedV.toString(16), 4)
      tx.r = Buffer.from(response.r, "hex")
      tx.s = Buffer.from(response.s, "hex")

      const signedTxHex = `0x${tx.serialize().toString("hex")}`
      await this._destroyLedgerClientAsync()
      return signedTxHex
    } catch (err) {
      await this._destroyLedgerClientAsync()
      throw err
    }
  }
}

export { LedgerSubprovider }
