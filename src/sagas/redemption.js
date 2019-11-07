
import { call, put, select } from 'redux-saga/effects'
import { delay } from 'redux'

import { navigateTo } from '../lib/router/actions'

export const UPDATE_ADDRESSES = 'UPDATE_ADDRESSES'
export const UPDATE_TX_HASH = 'UPDATE_TX_HASH'
export const UPDATE_CONFIRMATIONS = 'UPDATE_CONFIRMATIONS'
export const POLL_FOR_CONFIRMATIONS_ERROR = 'POLL_FOR_CONFIRMATIONS_ERROR'

export function* saveAddresses({ btcAddress, ethAddress }) {
    yield put({
        type: UPDATE_ADDRESSES,
        payload: {
            btcAddress,
            ethAddress
        }
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
    const requiredConfirmations = select(state => state.redemption.requiredConfirmations)

    while(confirmations < requiredConfirmations) {
        try {
            // TODO: yield call to electrum, request confirmations
            // TODO: Update newConfirmations
            const newConfirmations = "TODO"

            yield put({
                type: UPDATE_CONFIRMATIONS,
                payload: { confirmations: newConfirmations }
            })

            yield call(delay, 10000)

            confirmations = select( state => state.redemption.confirmations)
        } catch(err) {
            yield put({
                type: POLL_FOR_CONFIRMATIONS_ERROR,
                payload: { pollForConfirmationsError: err }
            })

            break
        }
    }

    const pollForConfirmationsError = select(state => state.redemption.pollForConfirmationsError)
    if (!pollForConfirmationsError) {
        yield put(navigateTo('/redeem/congratulations'))
    }
}