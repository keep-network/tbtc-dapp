import { combineReducers } from "redux"
import {
  DEPOSIT_REQUEST_SUCCESS,
  DEPOSIT_AUTO_SUBMIT_PROOF,
  BTC_TX_SEEN,
  BTC_TX_CONFIRMED_ALL,
  DEPOSIT_PROVE_BTC_TX_BEGIN,
  DEPOSIT_MINT_TBTC_SUCCESS,
} from "../sagas/deposit"

const initialState = {
  activeStepIndex: null,
  completedStepIndex: null,
}

const deposit = (state = initialState, action) => {
  switch (action.type) {
    case DEPOSIT_REQUEST_SUCCESS:
      return {
        ...state,
        completedStepIndex: 1,
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
