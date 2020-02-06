import { combineReducers } from 'redux'

import deposit from './deposit.js'
import redemption from './redemption.js'
import modal from './modal.js'
import account from './account.js'

const reducers = combineReducers({
    deposit,
    redemption,
    modal,
    account
})

export default reducers
