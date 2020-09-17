import { combineReducers } from "redux"

import deposit from "./deposit.js"
import redemption from "./redemption.js"
import modal from "./modal.js"
import walletModal from "./wallet-modal.js"
import account from "./account.js"
import tbtc from "./tbtc"

const reducers = combineReducers({
  deposit,
  redemption,
  modal,
  walletModal,
  account,
  tbtc,
})

export default reducers
