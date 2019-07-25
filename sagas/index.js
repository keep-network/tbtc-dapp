import { call, put, takeEvery, takeLatest } from 'redux-saga/effects'

export const REQUEST_A_DEPOSIT = 'REQUEST_A_DEPOSIT'
export const DEPOSIT_REQUEST_BEGIN = 'DEPOSIT_REQUEST_BEGIN'
export const DEPOSIT_REQUEST_SUCCESS = 'DEPOSIT_REQUEST_SUCCESS'
export const DEPOSIT_BTC_ADDRESS = 'DEPOSIT_BTC_ADDRESS'

export const WAIT_CONFIRMATION = 'WAIT_CONFIRMATION'

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
        type: 'DEPOSIT_BTC_ADDRESS',
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
        type: "BTC_TX_CONFIRMED",
        payload: {
            txid: 'ed469d3afbe6a4f69b729fc782ed6bf15fb7017d7f4349227d48753c68ac04b3'
        }
    })
    
    // goto next
}

export default function* () {
    yield takeEvery("REQUEST_A_DEPOSIT", requestADeposit)
    yield takeEvery('WAIT_CONFIRMATION', waitConfirmation)
}