import { call, put, takeEvery, takeLatest } from 'redux-saga/effects'

export const REQUEST_A_DEPOSIT = 'REQUEST_A_DEPOSIT'
export const DEPOSIT_REQUEST_BEGIN = 'DEPOSIT_REQUEST_BEGIN'
export const DEPOSIT_REQUEST_SUCCESS = 'DEPOSIT_REQUEST_SUCCESS'
export const DEPOSIT_BTC_ADDRESS = 'DEPOSIT_BTC_ADDRESS'
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

export default function* () {
    yield takeEvery("REQUEST_A_DEPOSIT", requestADeposit);
}