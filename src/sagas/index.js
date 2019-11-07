import { takeLatest, takeLeading} from 'redux-saga/effects'

import { requestADeposit, waitConfirmation, proveDeposit } from './deposit'
import { saveAddresses, broadcastTransaction, pollForConfirmations } from './redemption'
import {
    REQUEST_A_DEPOSIT,
    WAIT_CONFIRMATION,
    SUBMIT_DEPOSIT_PROOF,
    SAVE_ADDRESSES,
    BROADCAST_TRANSACTION,
    POLL_FOR_CONFIRMATION } from '../actions'

export default function* () {
    yield takeLatest(REQUEST_A_DEPOSIT, requestADeposit)
    yield takeLatest(WAIT_CONFIRMATION, waitConfirmation)
    yield takeLeading(SUBMIT_DEPOSIT_PROOF, proveDeposit)
    yield takeLatest(SAVE_ADDRESSES, saveAddresses)
    yield takeLatest(BROADCAST_TRANSACTION, broadcastTransaction)
    yield takeLatest(POLL_FOR_CONFIRMATION, pollForConfirmations)
}
