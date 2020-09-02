import {
  UPDATE_ADDRESSES,
  UPDATE_TX_HASH,
  SIGN_TX_ERROR,
  REDEMPTION_REQUIRED_CONFIRMATIONS,
  REDEMPTION_CONFIRMATION,
  REDEMPTION_CONFIRMATION_ERROR,
  REDEMPTION_PROVE_BTC_TX_BEGIN,
  REDEMPTION_PROVE_BTC_TX_SUCCESS,
  REDEMPTION_PROVE_BTC_TX_ERROR,
  REDEMPTION_REQUESTED,
  REDEMPTION_REQUEST_ERROR,
} from "../sagas/redemption"

import { RESTORE_REDEMPTION_STATE, RESET_STATE } from "../actions"
import { HISTORY_PUSH } from "../lib/router/actions"
import { DEPOSIT_STATE_RESTORED, DEPOSIT_RESOLVED } from "../sagas/deposit"

const initialState = {
  btcAddress: null,
  depositAddress: null,
  unsignedTransaction: null,
  txHash: null,
  requiredConfirmations: 1,
  confirmations: 0,
  confirmationError: null,
  redemption: null,
  isStateReady: false,
}

const redemption = (state = initialState, action) => {
  switch (action.type) {
    case RESET_STATE:
      return initialState
    case RESTORE_REDEMPTION_STATE:
      return {
        ...state,
        depositAddress: action.payload.depositAddress,
      }
    case DEPOSIT_STATE_RESTORED:
      return {
        ...state,
        isStateReady: true,
      }
    case DEPOSIT_RESOLVED:
      return {
        ...state,
        deposit: action.payload.deposit,
      }
    case UPDATE_ADDRESSES:
      return {
        ...state,
        btcAddress: action.payload.btcAddress,
        depositAddress: action.payload.depositAddress,
      }
    case SIGN_TX_ERROR:
      return {
        ...state,
        signTxError: action.payload.error,
      }
    case UPDATE_TX_HASH:
      return {
        ...state,
        txHash: action.payload.txHash,
      }
    case REDEMPTION_REQUIRED_CONFIRMATIONS:
      return {
        ...state,
        requiredConfirmations: action.payload.requiredConfirmations,
        confirmationError: null,
      }
    case REDEMPTION_CONFIRMATION:
      return {
        ...state,
        confirmations: action.payload.confirmations,
      }
    case REDEMPTION_CONFIRMATION_ERROR:
      return {
        ...state,
        confirmationError: action.payload.error,
      }
    case REDEMPTION_REQUESTED:
      return {
        ...state,
        redemption: action.payload.redemption,
        requestRedemptionError: null,
        signTxError: null,
      }
    case REDEMPTION_REQUEST_ERROR:
      return {
        ...state,
        requestRedemptionError: action.payload.error,
      }
    case REDEMPTION_PROVE_BTC_TX_BEGIN:
      return {
        ...state,
        provingRedemption: true,
        proveRedemptionError: null,
      }
    case REDEMPTION_PROVE_BTC_TX_SUCCESS:
      return {
        ...state,
        provingRedemption: false,
        proveRedemptionError: null,
      }
    case REDEMPTION_PROVE_BTC_TX_ERROR:
      return {
        ...state,
        provingRedemption: false,
        proveRedemptionError: action.payload.error,
      }
    case HISTORY_PUSH:
      return {
        ...state,
        requestRedemptionError: null,
        signTxError: null,
        confirmationError: null,
        proveRedemptionError: null,
      }
    default:
      return state
  }
}

export default redemption
