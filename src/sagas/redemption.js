import { TBTCLoaded } from "../wrappers/web3"
/** @typedef { import("@keep-network/tbtc.js").TBTC } TBTC */
/** @typedef { import("@keep-network/tbtc.js").Redemption } Redemption */
/** @typedef { import("@keep-network/tbtc.js").Deposit } Deposit */

import { call, put, select } from 'redux-saga/effects'

import { navigateTo } from '../lib/router/actions'
import { DEPOSIT_RESOLVED } from "./deposit"

export const UPDATE_ADDRESSES = 'UPDATE_ADDRESSES'
export const UPDATE_TRANSACTION_AND_SIGNATURE = 'UPDATE_TRANSACTION_AND_SIGNATURE'
export const UPDATE_TX_HASH = 'UPDATE_TX_HASH'
export const UPDATE_CONFIRMATIONS = 'UPDATE_CONFIRMATIONS'
export const POLL_FOR_CONFIRMATIONS_ERROR = 'POLL_FOR_CONFIRMATIONS_ERROR'
export const REDEMPTION_PROVE_BTC_TX_BEGIN = 'REDEMPTION_PROVE_BTC_TX_BEGIN'
export const REDEMPTION_PROVE_BTC_TX_SUCCESS = 'REDEMPTION_PROVE_BTC_TX_SUCCESS'
export const REDEMPTION_PROVE_BTC_TX_ERROR = 'REDEMPTION_PROVE_BTC_TX_ERROR'

export function* saveAddresses({ payload }) {
    yield put({
        type: UPDATE_ADDRESSES,
        payload,
    })

    /** @type {TBTC} */
    const tbtc = yield TBTCLoaded

    const deposit = yield call([tbtc.Deposit, tbtc.Deposit.withAddress], payload.depositAddress)

    yield put({
        type: DEPOSIT_RESOLVED,
        payload: {
            deposit,
        }
    })

    yield put(navigateTo('/deposit/' + payload.depositAddress + '/redemption'))
}

export function* requestRedemption() {
    /** @type Deposit */
    const deposit = yield select(state => state.redemption.deposit)
    /** @type string */
    const btcAddress = yield select(state => state.redemption.btcAddress)

    /** @type {Redemption} */
    const redemption = yield call([deposit, deposit.requestRedemption], btcAddress)
    yield* runRedemption(redemption)
}

export function* resumeRedemption() {
    /** @type {Deposit} */
    const deposit = yield select(state => state.redemption.deposit)
    const redemption = yield call([deposit, deposit.getCurrentRedemption])

    yield* runRedemption(redemption)
}

/**
 * @param {Redemption} redemption
 */
function* runRedemption(redemption) {
    const withdrawnPromise = redemption.autoSubmit()
    const depositAddress = redemption.deposit.address

    yield put(navigateTo('/deposit/' + depositAddress + '/redemption/signing'))

    yield redemption.signedTransaction

    yield put(navigateTo('/deposit/' + depositAddress + '/redemption/confirming'))

    yield withdrawnPromise

    yield put(navigateTo('/deposit/' + depositAddress + '/redemption/congratulations'))
}
