import { createActions, handleActions, combineActions } from 'redux-actions';
import { REQUEST_A_DEPOSIT, WAIT_CONFIRMATION } from '../sagas'

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