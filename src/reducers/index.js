import { combineReducers } from "redux"

import deposit from "./deposit.js"
import redemption from "./redemption.js"
import modal from "./modal.js"
import walletModal from "./wallet-modal.js"
import account from "./account.js"
import tbtc from "./tbtc"
import progressPanel from "./progress-panel.js"

const reducers = combineReducers({
  deposit,
  redemption,
  modal,
  walletModal,
  account,
  tbtc,
  progressPanel,
})

export default reducers
