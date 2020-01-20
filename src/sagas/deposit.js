import { call, put, select } from 'redux-saga/effects'

import { METAMASK_TX_DENIED_ERROR } from '../chain'

import {
    createDeposit,
    watchForPublicKeyPublished,
    getDepositBtcAddress,
    watchForTransaction,
    waitForConfirmations,
    getTransactionProof,
    submitFundingProof,
    getDepositCurrentState,
    DepositStates
} from 'tbtc-client'

import { notifyTransactionConfirmed } from '../lib/notifications/actions'
import { navigateTo } from '../lib/router/actions'
import { Web3Loaded } from '../wrappers/web3'

export const DEPOSIT_REQUEST_BEGIN = 'DEPOSIT_REQUEST_BEGIN'
export const DEPOSIT_REQUEST_METAMASK_SUCCESS = 'DEPOSIT_REQUEST_METAMASK_SUCCESS'
export const DEPOSIT_REQUEST_SUCCESS = 'DEPOSIT_REQUEST_SUCCESS'
export const DEPOSIT_PUBKEY_PUBLISHED = 'DEPOSIT_PUBKEY_PUBLISHED'
export const DEPOSIT_BTC_ADDRESS = 'DEPOSIT_BTC_ADDRESS'
export const DEPOSIT_STATE_RESTORED = 'DEPOSIT_STATE_RESTORED'

export const BTC_TX_MINED = 'BTC_TX_MINED'
export const BTC_TX_CONFIRMED_WAIT = 'BTC_TX_CONFIRMED_WAIT'
export const BTC_TX_CONFIRMED = 'BTC_TX_CONFIRMED'

export const DEPOSIT_PROVE_BTC_TX_BEGIN = 'DEPOSIT_PROVE_BTC_TX_BEGIN'
export const DEPOSIT_PROVE_BTC_TX_SUCCESS = 'DEPOSIT_PROVE_BTC_TX_SUCCESS'
export const DEPOSIT_PROVE_BTC_TX_ERROR = 'DEPOSIT_PROVE_BTC_TX_ERROR'

const ElectrumClient = require('tbtc-helpers').ElectrumClient

// TODO: Extract to a common file as this function is reused across scripts.
export async function getElectrumClient() {
    const config = require('../config/config.json')

    const electrumClient = new ElectrumClient.Client(config.electrum.testnetWS)

    await electrumClient.connect()

    return electrumClient
}

export function* restoreDepositState() {
    const web3Loaded = yield Web3Loaded

    const depositAddress = yield select(state => state.deposit.depositAddress)

    let depositState = yield call(getDepositCurrentState, depositAddress)

    switch(depositState.toNumber()) {
        case DepositStates.START:
            throw "Unexpected state."

        // Funding flow.
        case DepositStates.AWAITING_SIGNER_SETUP:
            yield put(navigateTo('/deposit/' + depositAddress + '/generate-address'))
            break
        
        case DepositStates.AWAITING_BTC_FUNDING_PROOF:
            yield put({
                type: DEPOSIT_STATE_RESTORED,
            })
            yield put(navigateTo('/deposit/' + depositAddress + '/pay'))
            break
        
        // Funding failure states
        case DepositStates.FRAUD_AWAITING_BTC_FUNDING_PROOF:
        case DepositStates.FAILED_SETUP:
            // TODO
            break

        case DepositStates.ACTIVE: 
            // TODO
            // yield put(navigateTo('/deposit/' + depositAddress + '/view'))
            break
        
        // Redemption flow
        // TODO
        // case AWAITING_WITHDRAWAL_SIGNATURE:
        // case AWAITING_WITHDRAWAL_PROOF:
        // case REDEEMED:    
    }
    
    // Here, we need to look at the logs. getDepositBtcAddress submits a
    // signed tx to Metamask, so that's not what we need.
    //
    // Then, we need to dispatch an update to the state.

    //yield put({ type:  })
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
    yield put(navigateTo('/deposit/' + depositAddress + '/pay'))
}

export function* waitConfirmation() {
    const electrumClient = yield call(getElectrumClient)
    const TESTNET_FUNDING_AMOUNT_SATOSHIS = 1000

    // wait for the transaction to be received and mined
    const depositAddress = yield select(state => state.deposit.depositAddress)
    const btcAddress = yield select(state => state.deposit.btcAddress)
    const fundingTx = yield call(watchForTransaction, electrumClient, btcAddress, TESTNET_FUNDING_AMOUNT_SATOSHIS)

    yield put({
        type: BTC_TX_MINED,
        payload: {
            btcDepositedTxID: fundingTx.transactionID,
            fundingOutputIndex: fundingTx.outputPosition
        }
    })

    // wait a certain number of confirmations on this step
    yield put({
        type: BTC_TX_CONFIRMED_WAIT
    })

    const requiredConfirmations = 1 // TODO: We can get the value from contract with `getTxProofDifficultyFactor`
    yield call(waitForConfirmations, electrumClient, fundingTx.transactionID, requiredConfirmations)

    // Close connection to electrum server.
    electrumClient.close()

    // when it's finally sufficiently confirmed, dispatch the txid
    yield put({
        type: BTC_TX_CONFIRMED
    })

    // emit a notification
    yield put(notifyTransactionConfirmed())

    // goto
    yield put(navigateTo('/deposit/' + depositAddress + 'prove'))
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
        yield put(navigateTo('/deposit/' + depositAddress + '/congratulations'))

    } catch (outerErr) {
        yield put({
            type: DEPOSIT_PROVE_BTC_TX_ERROR,
            payload: { error: outerErr.toString() }
        })
    }
}
