import { SET_ETHEREUM_ACCOUNT } from '../actions/index.js'

const initialState = ""

const account = (state = initialState, action) => {
  switch (action.type) {
    case SET_ETHEREUM_ACCOUNT:
      return action.payload.account

    default:
      return state || ""
  }
}

export default account
