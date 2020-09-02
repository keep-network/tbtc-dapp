import { combineReducers } from "redux"

import deposit from "./deposit.js"
import redemption from "./redemption.js"
import modal from "./modal.js"
import account from "./account.js"
import tbtc from "./tbtc"

const reducers = combineReducers({
  deposit,
  redemption,
  modal,
  account,
  tbtc,
})

export default reducers
