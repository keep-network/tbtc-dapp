import { TrezorSubprovider as TrezorSubprovider0x } from "@0x/subproviders/lib/src/subproviders/trezor"
import web3Utils from "web3-utils"
import {
  getChainIdFromSignedV,
  buildTransactionForChain,
  hexToPaddedBuffer,
} from "./utils"

export class TrezorSubprovider extends TrezorSubprovider0x {
  chainId

  constructor({ chainId, trezorConnectClientApi }) {
    super({
      trezorConnectClientApi,
      networkId: chainId,
    })

    this.chainId = chainId
  }

  async signTransactionAsync(txData) {
    if (txData.from === undefined || !web3Utils.isAddress(txData.from)) {
      throw new Error("Invalid address")
    }
    txData.value = txData.value || "0x0"
    txData.data = txData.data || "0x"
    txData.gas = txData.gas || "0x0"
    txData.gasPrice = txData.gasPrice || "0x0"

    const initialDerivedKeyInfo = await this._initialDerivedKeyInfoAsync()
    const derivedKeyInfo = this._findDerivedKeyInfoForAddress(
      initialDerivedKeyInfo,
      txData.from
    )
    const fullDerivationPath = derivedKeyInfo.derivationPath

    const response = await this._trezorConnectClientApi.ethereumSignTransaction(
      {
        path: fullDerivationPath,
        transaction: {
          to: txData.to,
          value: txData.value,
          data: txData.data,
          chainId: this.chainId,
          nonce: txData.nonce,
          gasLimit: txData.gas,
          gasPrice: txData.gasPrice,
        },
      }
    )

    if (!response.success) {
      throw new Error(response)
    }

    const {
      payload: { v, r, s },
    } = response

    // Validate `v`.
    const chainIdFromV = getChainIdFromSignedV(v)
    if (chainIdFromV !== this.chainId) {
      throw new Error("Invalid chainID")
    }

    const tx = buildTransactionForChain(txData, this.chainId)

    // Store signature in transaction.
    // Pad `v` in case the chainId encodes as an odd number of hex digits.
    tx.v = hexToPaddedBuffer(v, 4)
    tx.r = Buffer.from(r.slice(2), "hex")
    tx.s = Buffer.from(s.slice(2), "hex")

    return `0x${tx.serialize().toString("hex")}`
  }
}
