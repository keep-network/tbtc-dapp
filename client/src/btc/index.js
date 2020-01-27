export * from './transaction'
export * from './proof'

import { BigNumber } from 'bignumber.js'
BigNumber.config({ DECIMAL_PLACES: 8 })

/**
 * The number of satoshis in 1 BTC, as a bignumber.js BigNumber with 8-decimal
 * precision. Can be multiplied by a BTC amount to get a satoshi amount.
 */
export const satoshisInBtc = new BigNumber(10).pow(8)
/**
 * The number of BTC in 1 satoshi, as a bignumber.js BigNumber with 8-decimal
 * precision. Can be multiplied by a satoshi amount to get a BTC amount.
 */
export const btcInSatoshis = new BigNumber(1).div(satoshisInBtc)
