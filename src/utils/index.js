import { BitcoinHelpers } from "@keep-network/tbtc.js"

import BigNumber from "bignumber.js"
BigNumber.set({ DECIMAL_PLACES: 8 })

export function formatSatsToBtc(sats) {
  return new BigNumber(sats.toString())
    .div(BitcoinHelpers.satoshisPerBtc.toString())
    .toString()
}

export function getEtherscanUrl(chainId, address) {
  return `https://${
    chainId === 3 ? "ropsten." : ""
  }etherscan.io/address/${address}`
}

export function getLotInTbtc(state) {
  const { lotInSatoshis, signerFeeInSatoshis } = state.deposit
  const mintedSatoshis = lotInSatoshis.sub(signerFeeInSatoshis)

  return formatSatsToBtc(mintedSatoshis)
}
