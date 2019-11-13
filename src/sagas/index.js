import { takeLatest, takeLeading} from 'redux-saga/effects'

import {
    requestADeposit,
    waitConfirmation,
    proveDeposit } from './deposit'
import {
    saveAddresses,
    requestRedemption,
    buildTransactionAndSubmitSignature,
    broadcastTransaction,
    pollForConfirmations,
    submitRedemptionProof } from './redemption'
import {
    REQUEST_A_DEPOSIT,
    WAIT_CONFIRMATION,
    SUBMIT_DEPOSIT_PROOF,
    SAVE_ADDRESSES,
    REQUEST_REDEMPTION,
    BUILD_TRANSACTION_AND_SUBMIT_SIGNATURE,
    BROADCAST_TRANSACTION,
    POLL_FOR_CONFIRMATION,
    SUBMIT_REDEMPTION_PROOF } from '../actions'

export default function* () {
    yield takeLatest(REQUEST_A_DEPOSIT, requestADeposit)
    yield takeLatest(WAIT_CONFIRMATION, waitConfirmation)
    yield takeLeading(SUBMIT_DEPOSIT_PROOF, proveDeposit)
    yield takeLatest(SAVE_ADDRESSES, saveAddresses)
    yield takeLatest(REQUEST_REDEMPTION, requestRedemption)
    yield takeLatest(BUILD_TRANSACTION_AND_SUBMIT_SIGNATURE, buildTransactionAndSubmitSignature)
    yield takeLatest(BROADCAST_TRANSACTION, broadcastTransaction)
    yield takeLatest(POLL_FOR_CONFIRMATION, pollForConfirmations)
    yield takeLatest(SUBMIT_REDEMPTION_PROOF, submitRedemptionProof)
}
