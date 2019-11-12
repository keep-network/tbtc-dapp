
import { call, put, select, delay } from 'redux-saga/effects'

import { navigateTo } from '../lib/router/actions'

import {
    requestRedemption,
    createUnsignedTransaction,
    watchForSignatureSubmitted,
    provideRedemptionSignature,
    combineSignedTransaction,
    broadcastBTCTransaction,
    provideRedemptionProof,
    waitForConfirmations
} from 'tbtc-client'

import { getElectrumClient } from './deposit'

export const UPDATE_ADDRESSES = 'UPDATE_ADDRESSES'
export const UPDATE_TRANSACTION_AND_SIGNATURE = 'UPDATE_TRANSACTION_AND_SIGNATURE'
export const UPDATE_TX_HASH = 'UPDATE_TX_HASH'
export const UPDATE_CONFIRMATIONS = 'UPDATE_CONFIRMATIONS'
export const POLL_FOR_CONFIRMATIONS_ERROR = 'POLL_FOR_CONFIRMATIONS_ERROR'
export const REDEMPTION_PROVE_BTC_TX_BEGIN = 'REDEMPTION_PROVE_BTC_TX_BEGIN'
export const REDEMPTION_PROVE_BTC_TX_SUCCESS = 'REDEMPTION_PROVE_BTC_TX_SUCCESS'
export const REDEMPTION_PROVE_BTC_TX_ERROR = 'REDEMPTION_PROVE_BTC_TX_ERROR'

// TODO: rename to `requestRedemption`?
export function* saveAddresses({ payload }) {
    const { depositAddress, btcAddress } = payload

    console.log(`start redemption of deposit [${depositAddress}] to bitcoin address [${btcAddress}]`)
    yield call(requestRedemption, depositAddress, btcAddress)

    yield put({
        type: UPDATE_ADDRESSES,
        payload
    })

    yield put(navigateTo('/redeem/signing'))
}

export function* buildTransactionAndSubmitSignature() {
    const depositAddress = yield select(state => state.redemption.depositAddress)

    console.log(`build redemption transaction`)
    const unsignedTransaction = yield call(createUnsignedTransaction, depositAddress)

    console.log(`watch for transaction signature`)
    const signature = yield call(watchForSignatureSubmitted, depositAddress, unsignedTransaction.digest)

    console.log(`submit signature to deposit contract`)
    yield call(provideRedemptionSignature, depositAddress, signature.r, signature.s, signature.recoveryID)

    yield put({
        type: UPDATE_TRANSACTION_AND_SIGNATURE,
        payload: { unsignedTransaction, signature }
    })

    yield put(navigateTo('/redeem/confirming'))
}

export function* broadcastTransaction() {
    const depositAddress = yield select(state => state.redemption.depositAddress)
    const unsignedTransaction = yield select(state => state.redemption.unsignedTransaction)
    const signature = yield select(state => state.redemption.signature)

    console.log(`add signature to redemption transaction`)
    const signedTransaction = yield call(combineSignedTransaction, depositAddress, unsignedTransaction.hex, signature.r, signature.s)

    console.log(`broadcast redemption transaction`)
    const electrumClient = yield call(getElectrumClient)
    const txHash = yield call(broadcastBTCTransaction, electrumClient, signedTransaction)

    electrumClient.close()

    yield put({
        type: UPDATE_TX_HASH,
        payload: { txHash }
    })

    yield call(pollForConfirmations)
}

export function* pollForConfirmations() {
    let confirmations = 0
    const txHash = yield select(state => state.redemption.txHash)
    const requiredConfirmations = yield select(state => state.redemption.requiredConfirmations)

    const electrumClient = yield call(getElectrumClient)

    console.log(`wait for [${requiredConfirmations}] transaction confirmations`)
    while (confirmations < requiredConfirmations) {
        try {
            confirmations = yield call(waitForConfirmations, electrumClient, txHash, confirmations)
            console.log(`got [${confirmations}] transaction confirmations`)

            yield put({
                type: UPDATE_CONFIRMATIONS,
                payload: { confirmations }
            })
        } catch (err) {
            yield put({
                type: POLL_FOR_CONFIRMATIONS_ERROR,
                payload: { pollForConfirmationsError: err.toString() }
            })

            break
        }
    }

    electrumClient.close()

    const pollForConfirmationsError = yield select(state => state.redemption.pollForConfirmationsError)
    if (!pollForConfirmationsError) {
        yield put(navigateTo('/redeem/prove'))
    }
}

export function* submitRedemptionProof() {
    yield put({ type: REDEMPTION_PROVE_BTC_TX_BEGIN })

    const depositAddress = yield select(state => state.redemption.depositAddress)
    const txHash = yield select(state => state.redemption.txHash)

    const electrumClient = yield call(getElectrumClient)

    console.log(`submit redemption transaction proof`)
    try {
        yield call(provideRedemptionProof, depositAddress, txHash, electrumClient)

        yield put({
            type: REDEMPTION_PROVE_BTC_TX_SUCCESS,
        })

        yield put(navigateTo('/redeem/congratulations'))
    } catch (err) {
        yield put({
            type: REDEMPTION_PROVE_BTC_TX_ERROR,
            payload: { error: err.toString() }
        })
    } finally {
        electrumClient.close()
    }
}
