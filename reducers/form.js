import { DEPOSIT_BTC_ADDRESS, DEPOSIT_REQUEST_SUCCESS } from "../sagas";

const intialState = {
    step: 1,
    btcAddress: null,
    depositAddress: null
}

export function form(state = intialState, action) {
    switch(action.type) {
        case DEPOSIT_BTC_ADDRESS:
            return {
                ...state,
                btcAddress: action.payload.btcAddress
            }
        case DEPOSIT_REQUEST_SUCCESS:
            return {
                ...state,
                depositAddress: action.payload.depositAddress
            }
    }
    return state
}