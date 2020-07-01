import { call, put, select } from 'redux-saga/effects'

import { METAMASK_TX_DENIED_ERROR } from '../chain'

import { notifyTransactionConfirmed } from '../lib/notifications/actions'
import { navigateTo } from '../lib/router/actions'
import { TBTCLoaded } from '../wrappers/web3'
import { resumeRedemption } from './redemption'

import BN from "bn.js"

/** @typedef { import("@keep-network/tbtc.js").TBTC } TBTC */
/** @typedef { import("@keep-network/tbtc.js").Deposit } Deposit */

export const DEPOSIT_REQUEST_BEGIN = 'DEPOSIT_REQUEST_BEGIN'
export const DEPOSIT_REQUEST_METAMASK_SUCCESS = 'DEPOSIT_REQUEST_METAMASK_SUCCESS'
export const DEPOSIT_REQUEST_SUCCESS = 'DEPOSIT_REQUEST_SUCCESS'
export const DEPOSIT_RESOLVED = 'DEPOSIT_RESOLVED'
export const DEPOSIT_BTC_ADDRESS = 'DEPOSIT_BTC_ADDRESS'
export const DEPOSIT_BTC_ADDRESS_FAILED = 'DEPOSIT_BTC_ADDRESS_FAILED'
export const DEPOSIT_STATE_RESTORED = 'DEPOSIT_STATE_RESTORED'
export const DEPOSIT_BTC_AMOUNTS = 'DEPOSIT_BTC_AMOUNTS'
export const DEPOSIT_AUTO_SUBMIT_PROOF = 'DEPOSIT_AUTO_SUBMIT_PROOF'

export const BTC_TX_MINED = 'BTC_TX_MINED'
export const BTC_TX_CONFIRMED_WAIT = 'BTC_TX_CONFIRMED_WAIT'
export const BTC_TX_CONFIRMED = 'BTC_TX_CONFIRMED'

export const DEPOSIT_PROVE_BTC_TX_BEGIN = 'DEPOSIT_PROVE_BTC_TX_BEGIN'
export const DEPOSIT_PROVE_BTC_TX_SUCCESS = 'DEPOSIT_PROVE_BTC_TX_SUCCESS'
export const DEPOSIT_PROVE_BTC_TX_ERROR = 'DEPOSIT_PROVE_BTC_TX_ERROR'

function* restoreState(nextStepMap, stateKey) {
    /** @type {TBTC} */
    const tbtc = yield TBTCLoaded

    const depositAddress = yield select(state => state[stateKey].depositAddress)
    const deposit = yield tbtc.Deposit.withAddress(depositAddress)
    yield put({
        type: DEPOSIT_RESOLVED,
        payload: {
             deposit,
        }
    })

    /** @type {BN} */
    const depositState = yield call([deposit, deposit.getCurrentState])

    let finalCalls = null
    let nextStep = nextStepMap[depositState]

    switch(depositState) {
        case tbtc.Deposit.State.START:
            throw new Error("Unexpected state.")

        case tbtc.Deposit.State.AWAITING_WITHDRAWAL_PROOF:
            finalCalls = resumeRedemption
            // Explicitly fall through.

        case tbtc.Deposit.State.AWAITING_WITHDRAWAL_SIGNATURE:
        case tbtc.Deposit.State.AWAITING_BTC_FUNDING_PROOF:
        case tbtc.Deposit.State.REDEEMED:
        case tbtc.Deposit.State.ACTIVE:
            const btcAddress = yield call([deposit, deposit.getBitcoinAddress])
            yield put({
                type: DEPOSIT_BTC_ADDRESS,
                payload: {
                    btcAddress,
                }
            })

            const lotInSatoshis = yield call([deposit, deposit.getSatoshiLotSize])
            const signerFeeTbtc = yield call([deposit, deposit.getSignerFeeTBTC])
            const signerFeeInSatoshis = signerFeeTbtc.div(tbtc.satoshisPerTbtc)
            yield put({
                type: DEPOSIT_BTC_AMOUNTS,
                payload: {
                    lotInSatoshis,
                    signerFeeInSatoshis,
                }
            })

            if (finalCalls) {
                yield* finalCalls()
            }

            // FIXME Check to see if Electrum has already seen a tx for payment
            // FIXME and fast-forward to /pay/confirming if so.
            //
            // FIXME Check to see if we have a transaction in the mempool for
            // FIXME submitting funding proof, and update state accordingly.

            // Explicitly fall through.

        case tbtc.Deposit.State.AWAITING_SIGNER_SETUP:
            yield put({
                type: DEPOSIT_STATE_RESTORED,
            })

            const inVendingMachine = yield call([deposit, deposit.inVendingMachine])
            if (depositState === tbtc.Deposit.State.ACTIVE && ! inVendingMachine) {
                yield call([deposit, deposit.mintTBTC])
            }

            // TODO Fork on active vs await
            yield put(navigateTo('/deposit/' + depositAddress + nextStep))

            yield* onStateRestored(depositState)

            break

        // Funding failure states
        case tbtc.Deposit.State.FRAUD_AWAITING_BTC_FUNDING_PROOF:
        case tbtc.Deposit.State.FAILED_SETUP:
            // TODO Update deposit state to reflect situation.
            break

        default:
            throw new Error(`Unexpected state ${depositState.toNumber()}.`)
    }

    // Here, we need to look at the logs. getDepositBtcAddress submits a
    // signed tx to Metamask, so that's not what we need.
    //
    // Then, we need to dispatch an update to the state.

    //yield put({ type:  })
}

export function* restoreDepositState() {
    /** @type {TBTC} */
    const tbtc = yield TBTCLoaded

    const DEPOSIT_STEP_MAP = {};
    DEPOSIT_STEP_MAP[tbtc.Deposit.State.AWAITING_SIGNER_SETUP] = '/get-address'
    DEPOSIT_STEP_MAP[tbtc.Deposit.State.AWAITING_BTC_FUNDING_PROOF] = "/pay"
    DEPOSIT_STEP_MAP[tbtc.Deposit.State.ACTIVE] = "/congratulations"

    yield* restoreState(DEPOSIT_STEP_MAP, "deposit")
}

export function* restoreRedemptionState() {
    /** @type {TBTC} */
    const tbtc = yield TBTCLoaded

    const REDEMPTION_STEP_MAP = {};
    REDEMPTION_STEP_MAP[tbtc.Deposit.State.AWAITING_BTC_FUNDING_PROOF] = "/pay"
    REDEMPTION_STEP_MAP[tbtc.Deposit.State.ACTIVE] = "/redemption"
    REDEMPTION_STEP_MAP[tbtc.Deposit.State.AWAITING_WITHDRAWAL_SIGNATURE] = "/redemption/signing"
    REDEMPTION_STEP_MAP[tbtc.Deposit.State.AWAITING_WITHDRAWAL_PROOF] = "/redemption/prove"
    REDEMPTION_STEP_MAP[tbtc.Deposit.State.REDEEMED] = "/redemption/congratulations"

    yield* restoreState(REDEMPTION_STEP_MAP, "redemption")
}

export function* onStateRestored(depositState) {
    /** @type {TBTC} */
    const tbtc = yield TBTCLoaded

    switch(depositState) {
        case tbtc.Deposit.State.AWAITING_SIGNER_SETUP:
            yield* getBitcoinAddress()
            break
        case tbtc.Deposit.State.AWAITING_BTC_FUNDING_PROOF:
            yield* autoSubmitDepositProof()
            break
        default:
            // noop
            break
    }
}

export function* requestADeposit() {
    /** @type {TBTC} */
    const tbtc = yield TBTCLoaded

    // call Keep to request a deposit
    yield put({ type: DEPOSIT_REQUEST_BEGIN })

    /** @type {Deposit} */
    let deposit
    try {
        deposit = yield call([tbtc.Deposit, tbtc.Deposit.withSatoshiLotSize], new BN(1000000))
    } catch (err) {
        if (err.message.includes(METAMASK_TX_DENIED_ERROR)) return
        throw err
    }
    yield put({ type: DEPOSIT_REQUEST_METAMASK_SUCCESS })

    yield put({
        type: DEPOSIT_REQUEST_SUCCESS,
        payload: {
            depositAddress: deposit.address,
        }
    })

    // goto
    yield put(navigateTo('/deposit/' + deposit.address + '/get-address'))

    yield put({
        type: DEPOSIT_RESOLVED,
        payload: {
             deposit,
        }
    })

    yield* getBitcoinAddress()
}

export function* getBitcoinAddress() {
    /** @type {TBTC} */
    const tbtc = yield TBTCLoaded

    /** @type Deposit */
    const deposit = yield select(state => state.deposit.deposit)

    try {
        const btcAddress = yield deposit.bitcoinAddress
        yield put({
            type: DEPOSIT_BTC_ADDRESS,
            payload: {
                btcAddress,
            }
        })
    } catch (error) {
        yield put({
            type: DEPOSIT_BTC_ADDRESS_FAILED,
            payload: {
                error: error.message,
            }
        })
    }

    const lotInSatoshis = yield call([deposit, deposit.getSatoshiLotSize])
    const signerFeeTbtc = yield call([deposit, deposit.getSignerFeeTBTC])
    const signerFeeInSatoshis = signerFeeTbtc.div(tbtc.satoshisPerTbtc)
    yield put({
        type: DEPOSIT_BTC_AMOUNTS,
        payload: {
            lotInSatoshis,
            signerFeeInSatoshis,
        }
    })

    // goto
    yield put(navigateTo('/deposit/' + deposit.address + '/pay'))
    yield* autoSubmitDepositProof()
}

export function* autoSubmitDepositProof() {
    /** @type Deposit */
    const deposit = yield select(state => state.deposit.deposit)
    const didSubmitDepositProof =
        yield select(state => state.deposit.didSubmitDepositProof)

    if (didSubmitDepositProof) {
        return
    }

    const autoSubmission = deposit.autoSubmit()

    yield put({ type: DEPOSIT_AUTO_SUBMIT_PROOF })

    const fundingTx = yield autoSubmission.fundingTransaction

    yield put({
        // FIXME This is incorrect, at this point the transaction is _submitted_
        // FIXME but it is not yet _mined_, i.e. we only know for a fact that it
        // FIXME is in the mempool.
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

    // goto
    yield put(navigateTo('/deposit/' + deposit.address + '/pay/confirming'))

    yield autoSubmission.fundingConfirmations

    // when it's finally sufficiently confirmed, dispatch the txid
    yield put({
        type: BTC_TX_CONFIRMED
        // TODO Which transaction?
    })

    // emit a notification
    // FIXME This should be a reducer on BTC_TX_CONFIRMED.
    yield put(notifyTransactionConfirmed())

    // goto
    yield put(navigateTo('/deposit/' + deposit.address + '/prove'))

    try {
        yield put({ type: DEPOSIT_PROVE_BTC_TX_BEGIN })
        const proofTransaction = yield autoSubmission.proofTransaction

        yield put({
            type: DEPOSIT_PROVE_BTC_TX_SUCCESS,
            payload: {
                proofTransaction,
            }
        })
    } catch (error) {
        yield put({
            type: DEPOSIT_PROVE_BTC_TX_ERROR,
            payload: {
                error: error.message
            }
        })
    }

    yield call([deposit, deposit.mintTBTC])

    // goto
    yield put(navigateTo('/deposit/' + deposit.address + '/congratulations'))
}
