import { takeLatest } from "redux-saga/effects"

import {
  restoreDepositState,
  restoreRedemptionState,
  requestAvailableLotSizes,
  requestADeposit,
} from "./deposit"

import { saveAddresses, requestRedemption } from "./redemption"
import {
  RESTORE_DEPOSIT_STATE,
  RESTORE_REDEMPTION_STATE,
  REQUEST_AVAILABLE_LOT_SIZES,
  REQUEST_A_DEPOSIT,
  SAVE_ADDRESSES,
  REQUEST_REDEMPTION,
} from "../actions"

export default function* () {
  yield takeLatest(RESTORE_DEPOSIT_STATE, restoreDepositState)
  yield takeLatest(RESTORE_REDEMPTION_STATE, restoreRedemptionState)
  yield takeLatest(REQUEST_AVAILABLE_LOT_SIZES, requestAvailableLotSizes)
  yield takeLatest(REQUEST_A_DEPOSIT, requestADeposit)
  yield takeLatest(SAVE_ADDRESSES, saveAddresses)
  yield takeLatest(REQUEST_REDEMPTION, requestRedemption)
}
