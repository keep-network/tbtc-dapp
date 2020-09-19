import { combineReducers } from "redux"
import {
  DEPOSIT_REQUEST_BEGIN,
  DEPOSIT_AUTO_SUBMIT_PROOF,
  BTC_TX_SEEN,
  BTC_TX_CONFIRMED_ALL,
  DEPOSIT_PROVE_BTC_TX_BEGIN,
  DEPOSIT_MINT_TBTC_SUCCESS,
  DEPOSIT_STATE_RESTORED,
} from "../sagas/deposit"
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
    default:
      return state
  }
}

const progressPanel = combineReducers({
  deposit,
  redemption,
})

export default progressPanel
