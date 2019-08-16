import { call, put, takeLatest, select } from 'redux-saga/effects'
import history from '../history'

import {
    REQUEST_A_DEPOSIT,
    WAIT_CONFIRMATION,
    SUBMIT_DEPOSIT_PROOF,
    CLOSE_MODAL
} from '../actions'

import { METAMASK_TX_DENIED_ERROR } from '../chain'

import {
    createDeposit,
    getDepositBtcAddress,
    watchForFundingTransaction,
    waitForConfirmations,
    calculateAndSubmitFundingProof,
    watchForPublicKeyPublished
} from 'tbtc-client'

import {
    notifyBitcoinAddressReady,
    notifyTransactionConfirmed
} from '../lib/NotificationWrapper'

export const DEPOSIT_REQUEST_BEGIN = 'DEPOSIT_REQUEST_BEGIN'
export const DEPOSIT_REQUEST_METAMASK_SUCCESS = 'DEPOSIT_REQUEST_METAMASK_SUCCESS'
export const DEPOSIT_REQUEST_SUCCESS = 'DEPOSIT_REQUEST_SUCCESS'
export const DEPOSIT_PUBKEY_PUBLISHED = 'DEPOSIT_PUBKEY_PUBLISHED'
export const DEPOSIT_BTC_ADDRESS = 'DEPOSIT_BTC_ADDRESS'

export const BTC_TX_MINED = 'BTC_TX_MINED'
export const BTC_TX_CONFIRMED_WAIT = 'BTC_TX_CONFIRMED_WAIT'
export const BTC_TX_CONFIRMED = 'BTC_TX_CONFIRMED'

export const DEPOSIT_PROVE_BTC_TX_BEGIN = 'DEPOSIT_PROVE_BTC_TX_BEGIN'
export const DEPOSIT_PROVE_BTC_TX_SUCCESS = 'DEPOSIT_PROVE_BTC_TX_SUCCESS'

const ElectrumClient = require('tbtc-helpers').ElectrumClient

async function getElectrumClient() {
    const config = require('../config/config.json')
    const electrumClient = new ElectrumClient.Client(config.electrum.testnetWS)
    await electrumClient.connect()
    return electrumClient
}

function* requestADeposit() {
    // call Keep to request a deposit
    yield put({ type: DEPOSIT_REQUEST_BEGIN })

    let depositAddress
    try {
        // sign the transaction and submit
        depositAddress = yield call(createDeposit)
        yield put({ type: DEPOSIT_REQUEST_METAMASK_SUCCESS })
    } catch (err) {
        if (err.message.includes(METAMASK_TX_DENIED_ERROR)) return
        throw err
    }

    // wait for it to be mined
    // get the deposit address
    yield put({
        type: DEPOSIT_REQUEST_SUCCESS,
        payload: {
            depositAddress,
        }
    })

    // wait for deposit's public key to be published by the Keep
    yield call(watchForPublicKeyPublished, depositAddress)
    yield put({
        type: DEPOSIT_PUBKEY_PUBLISHED
    })

    let btcAddress
    try {
        // now call the deposit contract
        // and get the btc address
        btcAddress = yield call(getDepositBtcAddress, depositAddress)
        yield put({ type: DEPOSIT_REQUEST_METAMASK_SUCCESS })
    } catch (err) {
        if (err.message.includes(METAMASK_TX_DENIED_ERROR)) return
        throw err
    }

    yield put({
        type: DEPOSIT_BTC_ADDRESS,
        payload: {
            btcAddress,
        }
    })

    // emit a notification
    notifyBitcoinAddressReady()

    // goto
    history.push('/pay')
}

function* waitConfirmation() {
    const electrumClient = yield call(getElectrumClient)
    const TESTNET_FUNDING_AMOUNT_SATOSHIS = 1000

    // wait for the transaction to be received and mined
    const btcAddress = yield select(state => state.app.btcAddress)
    const fundingTx = yield call(watchForFundingTransaction, electrumClient, btcAddress, TESTNET_FUNDING_AMOUNT_SATOSHIS)

    yield put({
        type: BTC_TX_MINED,
        payload: {
            btcDepositedTxID: fundingTx.transactionID,
            fundingOutputIndex: fundingTx.fundingOutputPosition
        }
    })

    // wait a certain number of confirmations on this step
    yield put({
        type: BTC_TX_CONFIRMED_WAIT
    })

    yield call(waitForConfirmations, electrumClient, fundingTx.transactionID)

    // when it's finally sufficiently confirmed, dispatch the txid
    yield put({
        type: BTC_TX_CONFIRMED
    })

    // emit a notification
    notifyTransactionConfirmed()

    // goto
    history.push('/prove')
}

function* proveDeposit() {
    yield put({ type: DEPOSIT_PROVE_BTC_TX_BEGIN })

    const depositAddress = yield select(state => state.app.depositAddress)
    const btcDepositedTxID = yield select(state => state.app.btcDepositedTxID)
    const fundingOutputIndex = yield select(state => state.app.fundingOutputIndex)

    const electrumClient = yield call(getElectrumClient)

    // get the transaction details from the bitcoin chain
    // run through the proof generation process
    // generate a proof
    // again, call the web3 contract, submitting the proof
    let tbtcMintedTxID
    try {
        tbtcMintedTxID = yield call(
            calculateAndSubmitFundingProof,
            electrumClient,
            depositAddress,
            btcDepositedTxID,
            fundingOutputIndex
        )
    } catch (err) {
        if (err.message.includes(METAMASK_TX_DENIED_ERROR)) return
        throw err
    }

    yield put({
        type: DEPOSIT_PROVE_BTC_TX_SUCCESS,
        payload: {
            tbtcMintedTxID,
        }
    })

    yield put({
        type: CLOSE_MODAL
    })

    // goto
    history.push('/congratulations')
}

export default function* () {
    yield takeLatest(REQUEST_A_DEPOSIT, requestADeposit)
    yield takeLatest(WAIT_CONFIRMATION, waitConfirmation)
    yield takeLatest(SUBMIT_DEPOSIT_PROOF, proveDeposit)
}
