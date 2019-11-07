import { call, put, select } from 'redux-saga/effects'

import { METAMASK_TX_DENIED_ERROR } from '../chain'

import {
    createDeposit,
    watchForPublicKeyPublished,
    getDepositBtcAddress,
    watchForFundingTransaction,
    waitForConfirmations,
    getTransactionProof,
    submitFundingProof
} from 'tbtc-client'
import { notifyTransactionConfirmed } from '../lib/notifications/actions'
import { navigateTo } from '../lib/router/actions'

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
export const DEPOSIT_PROVE_BTC_TX_ERROR = 'DEPOSIT_PROVE_BTC_TX_ERROR'

const ElectrumClient = require('tbtc-helpers').ElectrumClient

async function getElectrumClient() {
    const config = require('../config/config.json')

    const electrumClient = new ElectrumClient.Client(config.electrum.testnetWS)

    await electrumClient.connect()

    return electrumClient
}

export function* requestADeposit() {
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

    // goto
    yield put(navigateTo('/deposit/pay'))
}

export function* waitConfirmation() {
    const electrumClient = yield call(getElectrumClient)
    const TESTNET_FUNDING_AMOUNT_SATOSHIS = 1000

    // wait for the transaction to be received and mined
    const btcAddress = yield select(state => state.deposit.btcAddress)
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

    // Close connection to electrum server.
    electrumClient.close()

    // when it's finally sufficiently confirmed, dispatch the txid
    yield put({
        type: BTC_TX_CONFIRMED
    })

    // emit a notification
    yield put(notifyTransactionConfirmed())

    // goto
    yield put(navigateTo('/deposit/prove'))
}

export function* proveDeposit() {
    try {
        yield put({ type: DEPOSIT_PROVE_BTC_TX_BEGIN })

        const depositAddress = yield select(state => state.deposit.depositAddress)
        const btcDepositedTxID = yield select(state => state.deposit.btcDepositedTxID)
        const fundingOutputIndex = yield select(state => state.deposit.fundingOutputIndex)

        const electrumClient = yield call(getElectrumClient)

        // TODO: We need to calculate confirmations value in a special way:
        // See: https://github.com/keep-network/tbtc-dapp/pull/8#discussion_r307438648
        // TODO: Original value `6` was decreased to `1` for demo simplification. Set it
        // back to `6`.
        const confirmations = 1

        // get the transaction details from the bitcoin chain
        // run through the proof generation process
        // generate a proof
        const transactionProof = yield call(
            getTransactionProof,
            electrumClient,
            btcDepositedTxID,
            confirmations
        )

        // again, call the web3 contract, submitting the proof
        let tbtcMintedTxID
        try {
            tbtcMintedTxID = yield call(
                submitFundingProof,
                depositAddress,
                transactionProof,
                fundingOutputIndex
            )
        } catch (err) {
            if (err.message.includes(METAMASK_TX_DENIED_ERROR)) return

            throw err
        }

        // Close connection to electrum server.
        electrumClient.close()

        yield put({
            type: DEPOSIT_PROVE_BTC_TX_SUCCESS,
            payload: {
                tbtcMintedTxID,
            }
        })

        // goto
        yield put(navigateTo('/deposit/congratulations'))

    } catch (outerErr) {
        yield put({
            type: DEPOSIT_PROVE_BTC_TX_ERROR,
            payload: { error: outerErr.toString() }
        })
    }
}