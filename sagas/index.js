import { call, put, takeEvery, takeLatest } from 'redux-saga/effects'

export const REQUEST_A_DEPOSIT = 'REQUEST_A_DEPOSIT'
export const DEPOSIT_REQUEST_BEGIN = 'DEPOSIT_REQUEST_BEGIN'
export const DEPOSIT_REQUEST_SUCCESS = 'DEPOSIT_REQUEST_SUCCESS'
export const DEPOSIT_BTC_ADDRESS = 'DEPOSIT_BTC_ADDRESS'

export const WAIT_CONFIRMATION = 'WAIT_CONFIRMATION'
export const BTC_TX_CONFIRMED = 'BTC_TX_CONFIRMED'

export const SUBMIT_DEPOSIT_PROOF = 'SUBMIT_DEPOSIT_PROOF'
export const DEPOSIT_PROVE_BTC_TX_SUCCESS = 'DEPOSIT_PROVE_BTC_TX_SUCCESS'

import Router from 'next/router';

function* requestADeposit() {
    // call Keep to request a deposit
    yield put({ type: 'DEPOSIT_REQUEST_BEGIN' })

    // sign the transaction and submit
    yield put({ type: 'DEPOSIT_REQUEST_METAMASK_SUCCESS' })

    // wait for it to be mined
    // get the deposit address
    yield put({ 
        type: 'DEPOSIT_REQUEST_SUCCESS',
        payload: {
            depositAddress: '0x'+'0'.repeat(40)
        }
    })

    // now call the deposit contract
    // and get the btc address
    // goto next
    yield put({
        type: DEPOSIT_BTC_ADDRESS,
        payload: {
            btcAddress: '1A1zP1eP5QGefi2DMPTfTL5SLmv7DivfNa'
        }
    })

    // goto
    Router.push('/initiate-deposit')
}

function* waitConfirmation() {
    // now show a waiting dialog, with some sort of smart countdown
    // wait for the transaction to be received
    // wait for the transaction to be confirmed
    yield put({
        type: "BTC_TX_MINED"
    })

    // wait a certain number of confirmations on this step
    yield put({
        type: "BTC_TX_CONFIRMED_WAIT"
    })

    // when it's finally sufficiently confirmed, dispatch the txid
    yield put({
        type: BTC_TX_CONFIRMED,
        payload: {
            btcDepositedTxid: 'ed469d3afbe6a4f69b729fc782ed6bf15fb7017d7f4349227d48753c68ac04b3'
        }
    })
    
    // goto next
}

function* proveDeposit(btcTxid) {
    // get the transaction details from the bitcoin chain
    // run through the proof generation process
    // generate a proof

    // again, call the web3 contract, submitting the proof
    yield put({ type: 'DEPOSIT_PROVE_BTC_TX_BEGIN' })

    // wait for the tx to be mined successfully
    yield put({ 
        type: DEPOSIT_PROVE_BTC_TX_SUCCESS,
        payload: {
            tbtcMintedTxId: '0x2260fac5e5542a773aa44fbcfedf7c193bc2c599'
        }
    })

    // goto next
    Router.push('/tbtc-minted')
}

export default function* () {
    yield takeEvery(REQUEST_A_DEPOSIT, requestADeposit)
    yield takeEvery(WAIT_CONFIRMATION, waitConfirmation)
    yield takeEvery(SUBMIT_DEPOSIT_PROOF, proveDeposit)
}