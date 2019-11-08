
import { call, put, select, delay } from 'redux-saga/effects'

import { navigateTo } from '../lib/router/actions'

export const UPDATE_ADDRESSES = 'UPDATE_ADDRESSES'
export const UPDATE_TRANSACTION_AND_SIGNATURE = 'UPDATE_TRANSACTION_AND_SIGNATURE'
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

    const contractAddress = yield select(state => state.redemption.contractAddress)
    // TODO: Submit Signature

    yield put(navigateTo('/redeem/broadcast'))
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