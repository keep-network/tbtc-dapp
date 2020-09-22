import { combineReducers } from "redux"
import {
  DEPOSIT_REQUEST_BEGIN,
  DEPOSIT_AUTO_SUBMIT_PROOF,
  BTC_TX_SEEN,
  BTC_TX_CONFIRMED_ALL,
  DEPOSIT_PROVE_BTC_TX_BEGIN,
  DEPOSIT_MINT_TBTC_SUCCESS,
  DEPOSIT_STATE_RESTORED,
  DEPOSIT_RESOLVED,
} from "../sagas/deposit"
import {
  REDEMPTION_REQUESTED,
  REDEMPTION_AUTO_SUBMIT,
  UPDATE_TX_HASH,
  REDEMPTION_PROVE_BTC_TX_BEGIN,
  REDEMPTION_PROVE_BTC_TX_SUCCESS,
} from "../sagas/redemption"
import { RESET_STATE } from "../actions"

const initialState = {
  activeStepIndex: null,
  completedStepIndex: null,
}

function getProgressStateFromDepositState(
  { currentDepositState, depositStates },
  state
) {
  switch (currentDepositState) {
    case depositStates.AWAITING_SIGNER_SETUP:
      return {
        completedStepIndex: 1,
        activeStepIndex: null,
      }
    case depositStates.ACTIVE:
    case depositStates.REDEEMED:
      return {
        completedStepIndex: 5,
        activeStepIndex: null,
      }
    default:
      return state
  }
}

const deposit = (state = initialState, action) => {
  switch (action.type) {
    case DEPOSIT_REQUEST_BEGIN:
      return {
        completedStepIndex: 1,
        activeStepIndex: null,
      }
    case DEPOSIT_AUTO_SUBMIT_PROOF:
      return {
        completedStepIndex: 1,
        activeStepIndex: 2,
      }
    case BTC_TX_SEEN:
      return {
        completedStepIndex: 2,
        activeStepIndex: 3,
      }
    case BTC_TX_CONFIRMED_ALL:
      return {
        completedStepIndex: 3,
        activeStepIndex: null,
      }
    case DEPOSIT_PROVE_BTC_TX_BEGIN:
      return {
        completedStepIndex: 3,
        activeStepIndex: 4,
      }
    case DEPOSIT_MINT_TBTC_SUCCESS:
      return {
        completedStepIndex: 5,
        activeStepIndex: null,
      }
    case DEPOSIT_STATE_RESTORED:
      return getProgressStateFromDepositState(action.payload, state)
    case RESET_STATE:
      return initialState
    default:
      return state
  }
}

const redemption = (state = initialState, action) => {
  switch (action.type) {
    case DEPOSIT_RESOLVED:
      return {
        completedStepIndex: 0,
        activeStepIndex: 1,
      }
    case REDEMPTION_REQUESTED:
      return {
        completedStepIndex: 1,
        activeStepIndex: null,
      }
    case REDEMPTION_AUTO_SUBMIT:
      return {
        completedStepIndex: 1,
        activeStepIndex: 2,
      }
    case UPDATE_TX_HASH:
      return {
        completedStepIndex: 2,
        activeStepIndex: 3,
      }
    case REDEMPTION_PROVE_BTC_TX_BEGIN:
      return {
        completedStepIndex: 3,
        activeStepIndex: 4,
      }
    case REDEMPTION_PROVE_BTC_TX_SUCCESS:
      return {
        completedStepIndex: 5,
        activeStepIndex: null,
      }
    case DEPOSIT_STATE_RESTORED:
      return getProgressStateFromDepositState(action.payload, state)
    case RESET_STATE:
      return initialState
    default:
      return state
  }
}

const progressPanel = combineReducers({
  deposit,
  redemption,
})

export default progressPanel
