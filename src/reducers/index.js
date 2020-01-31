import { combineReducers } from 'redux'

import deposit from './deposit.js'
import redemption from './redemption.js'
import modal from './modal.js'

import { SET_ETHEREUM_ACCOUNT } from '../actions/index.js'

const reducers = combineReducers({
    deposit,
    redemption,
    modal,
    account: (state, action) => {
        switch (action.type) {
            case SET_ETHEREUM_ACCOUNT:
                return action.payload.account

            default:
                return state || ""
        }
    }
})

export default reducers
