import { combineReducers } from 'redux'

import deposit from './deposit.js'
import redemption from './redemption.js'
import modal from './modal.js'

const reducers = combineReducers({ deposit, redemption, modal })

export default reducers