import { LedgerSubprovider as LedgerSubprovider0x } from "@0x/subproviders/lib/src/subproviders/ledger" // https://github.com/0xProject/0x-monorepo/issues/1400
import web3Utils from "web3-utils"
import { hexToPaddedBuffer, buildTransactionForChain } from "./utils"

/**
 * A custom Ledger subprovider, inheriting from the 0x Subprovider.
 *
 * Supports chains with a chainId > 255, and mitigates some issues with the
 * LedgerJS library.
 */
class LedgerSubprovider extends LedgerSubprovider0x {
  chainId

  constructor(config) {
    super(config)
    this.chainId = config.chainId
  }

  async signTransactionAsync(txParams) {
    LedgerSubprovider._validateTxParams(txParams)
    if (txParams.from === undefined || !web3Utils.isAddress(txParams.from)) {
      throw new Error("Invalid address")
    }
    const initialDerivedKeyInfo = await this._initialDerivedKeyInfoAsync()
    const derivedKeyInfo = this._findDerivedKeyInfoForAddress(
      initialDerivedKeyInfo,
      txParams.from
    )

    this._ledgerClientIfExists = await this._createLedgerClientAsync()

    try {
      const fullDerivationPath = derivedKeyInfo.derivationPath
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

      // Ledger computes the signature over the full 4 bytes of `v`, but the transport layer
      // only returns the lower 2 bytes. The returned `v` will be wrong for chainId's < 255,
      // and has to be recomputed by the client [1] [2].
      // [1]: https://github.com/LedgerHQ/ledgerjs/issues/168
      // [2]: https://github.com/LedgerHQ/ledger-app-eth/commit/8260268b0214810872dabd154b476f5bb859aac0
      const ledgerSignedV = parseInt(response.v, 16)

      // Recompute `v` according to the algorithm detailed in EIP155 [1].
      // [1] https://github.com/ethereum/EIPs/blob/master/EIPS/eip-155.md
      const eip155Constant = 35
      let signedV = this.chainId * 2 + eip155Constant
      if (ledgerSignedV % 2 === 0) {
        signedV += 1
      }

      // Verify signature `v` value returned from Ledger.
      if ((signedV & 0xff) !== ledgerSignedV) {
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
