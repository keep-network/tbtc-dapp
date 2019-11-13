
import { call, put, select, delay } from 'redux-saga/effects'

import { navigateTo } from '../lib/router/actions'

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
        payload
    })

    yield put(navigateTo('/redeem/redeeming'))
}

export function* requestRedemption({ payload }) {
    // TODO: Request Redemption

    // TODO: Burn TBTC

    yield put(navigateTo('/redeem/signing'))
}

export function* buildTransactionAndSubmitSignature() {
    const btcAddress = yield select(state => state.redemption.btcAddress)
    // TODO: Build Transaction
    const transaction = 'TODO'

    // TODO: Wait for + Save Signature
    const signature = 'TODO'

    yield put({
        type: UPDATE_TRANSACTION_AND_SIGNATURE,
        payload: { transaction, signature }
    })

    const depositAddress = yield select(state => state.redemption.depositAddress)
    // TODO: Submit Signature

    yield put(navigateTo('/redeem/confirming'))
}

export function* broadcastTransaction() {
    const transaction = yield select(state => state.redemption.transaction)
    const signature = yield select(state => state.redemption.signature)
    // TODO: Broadcast Signed Transaction

    // TODO: Save txHash to state
    const txHash = 'TODO'

    yield put({
        type: UPDATE_TX_HASH,
        payload: { txHash }
    })

    yield call(pollForConfirmations)
}

export function* pollForConfirmations() {
    let confirmations = 0
    const requiredConfirmations = yield select(state => state.redemption.requiredConfirmations)

    while(confirmations < requiredConfirmations) {
        try {
            // TODO: yield call to electrum, request confirmations

            // TODO: Update newConfirmations with real data
            const newConfirmations = confirmations + 1

            yield put({
                type: UPDATE_CONFIRMATIONS,
                payload: { confirmations: newConfirmations }
            })

            yield delay(10000)

            confirmations = yield select( state => state.redemption.confirmations)
        } catch(err) {
            yield put({
                type: POLL_FOR_CONFIRMATIONS_ERROR,
                payload: { pollForConfirmationsError: err.toString() }
            })

            break
        }
    }

    const pollForConfirmationsError = yield select(state => state.redemption.pollForConfirmationsError)
    if (!pollForConfirmationsError) {
        yield put(navigateTo('/redeem/prove'))
    }
}

export function* submitRedemptionProof() {
    yield put({ type: REDEMPTION_PROVE_BTC_TX_BEGIN })

    // TODO: Do proof stuff

    try {
        yield put({
            type: REDEMPTION_PROVE_BTC_TX_SUCCESS,
            payload: {}
        })

        yield put(navigateTo('/redeem/congratulations'))
    } catch (err) {
        yield put({
            type: REDEMPTION_PROVE_BTC_TX_ERROR,
            payload: { error: err.toString() }
        })
    }
}