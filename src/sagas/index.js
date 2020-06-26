import { takeLatest } from 'redux-saga/effects'

import {
    restoreDepositState,
    restoreRedemptionState,
    requestADeposit,
    getBitcoinAddress,
    autoSubmitDepositProof 
} from './deposit'

import {
    saveAddresses,
    requestRedemption,
    resumeRedemption,
} from './redemption'
import {
    RESTORE_DEPOSIT_STATE,
    RESTORE_REDEMPTION_STATE,
    REQUEST_A_DEPOSIT,
    GET_BITCOIN_ADDRESS,
    AUTO_SUBMIT_DEPOSIT_PROOF,
    SAVE_ADDRESSES,
    REQUEST_REDEMPTION,
    RESUME_REDEMPTION,
} from '../actions'

export default function* () {
    yield takeLatest(RESTORE_DEPOSIT_STATE, restoreDepositState)
    yield takeLatest(RESTORE_REDEMPTION_STATE, restoreRedemptionState)
    yield takeLatest(REQUEST_A_DEPOSIT, requestADeposit)
    yield takeLatest(GET_BITCOIN_ADDRESS, getBitcoinAddress)
    yield takeLatest(AUTO_SUBMIT_DEPOSIT_PROOF, autoSubmitDepositProof)
    yield takeLatest(SAVE_ADDRESSES, saveAddresses)
    yield takeLatest(REQUEST_REDEMPTION, requestRedemption)
    yield takeLatest(RESUME_REDEMPTION, resumeRedemption)
}
