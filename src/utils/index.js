import { BitcoinHelpers } from '@keep-network/tbtc.js'

import BN from "bn.js"

import BigNumber from "bignumber.js"
BigNumber.set({ DECIMAL_PLACES: 8 })

export function formatSatsToBtc(sats) {
    sats = BN.isBN(sats) ? sats.toString() : sats

    return new BigNumber(sats)
        .div(BitcoinHelpers.satoshisPerBtc.toString()).toString()
}
