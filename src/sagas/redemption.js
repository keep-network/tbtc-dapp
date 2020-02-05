
import { call, put, select, delay } from 'redux-saga/effects'

import { navigateTo } from '../lib/router/actions'

import { Script } from 'bcoin/lib/script'

import {
    requestRedemption as clientRequestRedemption,
    getLatestRedemptionDetails,
    createUnsignedTransaction,
    watchForSignatureSubmitted,
    provideRedemptionSignature,
    combineSignedTransaction,
    broadcastTransaction as clientBroadcastTransaction,
    provideRedemptionProof,
    waitForConfirmations,
    findTransaction
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

export function* saveAddresses({ payload }) {
    yield put({
        type: UPDATE_ADDRESSES,
        payload
    })

    yield put(navigateTo('/deposit/' + payload.depositAddress + '/redemption'))
}

export function* requestRedemption() {
    const redeemerAddress = yield select(state => state.account)
    const depositAddress = yield select(state => state.redemption.depositAddress)
    const btcAddress = yield select(state => state.redemption.btcAddress)

    console.log(`start redemption by [${redeemerAddress}] of deposit [${depositAddress}] to bitcoin address [${btcAddress}]`)
    yield call(clientRequestRedemption, depositAddress, redeemerAddress, btcAddress)

    yield put(navigateTo('/deposit/' + depositAddress + '/redemption/signing'))
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

    yield put(navigateTo('/deposit/' + depositAddress + '/redemption/signing'))
}

export function* broadcastTransaction() {
    const depositAddress = yield select(state => state.redemption.depositAddress)
    const unsignedTransaction = yield select(state => state.redemption.unsignedTransaction)
    const signature = yield select(state => state.redemption.signature)

    console.log(`add signature to redemption transaction`)
    const signedTransaction = yield call(combineSignedTransaction, depositAddress, unsignedTransaction.hex, signature.r, signature.s)

    console.log(`broadcast redemption transaction`)
    const electrumClient = yield call(getElectrumClient)
    const txHash = yield call(clientBroadcastTransaction, electrumClient, signedTransaction)

    electrumClient.close()

    yield put({
        type: UPDATE_TX_HASH,
        payload: { txHash }
    })

    yield call(pollForConfirmations)
}

export function* findOrSubmitTransaction() {
    const depositAddress = yield select(state => state.redemption.depositAddress)

    console.log(`Look up latest redemption details.`)
    // Look for redemption event.
    const { utxoSize, requestedFee,  requesterPKH } = yield call(getLatestRedemptionDetails, depositAddress)
    const expectedValue = utxoSize.sub(requestedFee).toNumber()
    const requesterAddress = Script.fromProgram(0, requesterPKH).getAddress().toBech32('testnet')

    console.log(`Search for existing redemption Bitcoin transaction.`)
    const electrumClient = yield call(getElectrumClient)
    const transaction = yield call(findTransaction, electrumClient, requesterAddress, expectedValue)

    console.log("Looked fer it and here we go", transaction, requesterAddress)
    if (transaction) {
        console.log(`Found existing redemption transaction ${transaction.transactionID}.`)

        yield put({
            type: UPDATE_TX_HASH,
            payload: { txHash: transaction.transactionID }
        })

        yield call(pollForConfirmations) // right thing to do?
    } else {
        console.log(`Existing transaction not found, building and submitting.`)
        yield* buildTransactionAndSubmitSignature()
    }
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

    const depositAddress = yield select(state => state.redemption.depositAddress)
    const pollForConfirmationsError = yield select(state => state.redemption.pollForConfirmationsError)
    if (!pollForConfirmationsError) {
        yield put(navigateTo('/deposit/' + depositAddress + '/redemption/prove'))
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

        yield put(navigateTo('/deposit/' + depositAddress + '/redemption/congratulations'))
    } catch (err) {
        yield put({
            type: REDEMPTION_PROVE_BTC_TX_ERROR,
            payload: { error: err.toString() }
        })
    } finally {
        electrumClient.close()
    }
}
