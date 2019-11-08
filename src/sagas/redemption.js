
import { call, put, select, delay } from 'redux-saga/effects'

import { navigateTo } from '../lib/router/actions'

export const UPDATE_ADDRESSES = 'UPDATE_ADDRESSES'
export const UPDATE_TX_HASH = 'UPDATE_TX_HASH'
export const UPDATE_CONFIRMATIONS = 'UPDATE_CONFIRMATIONS'
export const POLL_FOR_CONFIRMATIONS_ERROR = 'POLL_FOR_CONFIRMATIONS_ERROR'

export function* saveAddresses({ payload }) {
    yield put({
        type: UPDATE_ADDRESSES,
        payload
    })

    yield put(navigateTo('/redeem/signing'))
}

export function* broadcastTransaction() {
    const btcAddress = yield select(state => state.redemption.btcAddress)

    // TODO: Build + Broadcast Transaction

    // TODO: Save txHash to state
    const txHash = 'TODO'

    yield put({
        type: UPDATE_TX_HASH,
        payload: { txHash }
    })

    yield put(navigateTo('/redeem/confirming'))
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

            yield delay(1000)

            confirmations = yield select( state => state.redemption.confirmations)
        } catch(err) {
            yield put({
                type: POLL_FOR_CONFIRMATIONS_ERROR,
                payload: { pollForConfirmationsError: err }
            })

            break
        }
    }

    const pollForConfirmationsError = yield select(state => state.redemption.pollForConfirmationsError)
    if (!pollForConfirmationsError) {
        yield put(navigateTo('/redeem/congratulations'))
    }
}