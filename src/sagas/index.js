import { takeLatest, takeLeading} from 'redux-saga/effects'

import { requestADeposit, waitConfirmation, proveDeposit } from './deposit'
import { REQUEST_A_DEPOSIT, WAIT_CONFIRMATION, SUBMIT_DEPOSIT_PROOF } from '../actions'

export default function* () {
    yield takeLatest(REQUEST_A_DEPOSIT, requestADeposit)
    yield takeLatest(WAIT_CONFIRMATION, waitConfirmation)
    yield takeLeading(SUBMIT_DEPOSIT_PROOF, proveDeposit)
}
