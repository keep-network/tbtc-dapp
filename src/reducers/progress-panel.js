import { combineReducers } from "redux"
import { DEPOSIT_REQUEST_SUCCESS } from "../sagas/deposit"

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
