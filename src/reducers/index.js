import { combineReducers } from 'redux'

import deposit from './deposit.js'
import modal from './modal.js'

const reducers = combineReducers({ deposit, modal })

export default reducers