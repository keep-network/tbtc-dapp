import { createActions, handleActions, combineActions } from 'redux-actions';
import { REQUEST_A_DEPOSIT, WAIT_CONFIRMATION, SUBMIT_DEPOSIT_PROOF } from '../sagas'

export function requestADeposit() {
    return {
        type: REQUEST_A_DEPOSIT
    }
}

export function waitConfirmation() {
    return {
        type: WAIT_CONFIRMATION
    }
}

export function submitProof() {
    return {
        type: SUBMIT_DEPOSIT_PROOF
    }
}