import {
    SAVE_ADDRESSES,
    SAVE_TX_HASH,
    UPDATE_CONFIRMATIONS,
    POLL_FOR_CONFIRMATIONS_ERROR
} from '../sagas/redemption'

const initialState = {
    btcAddress: null,
    ethAddress: null,
    requiredConfirmations: 6,
    confirmations: 0,
    pollForConfirmationsError: null
}

const redemption = (state = initialState, action) => {
    switch (action.type) {
        case SAVE_ADDRESSES:
            return {
                ...state,
                btcAddress: action.payload.btcAddress,
                ethAddress: action.payload.ethAddress
            }
        case SAVE_TX_HASH:
            return {
                ...state,
                txHash: action.payload.txHash
            }
        case UPDATE_CONFIRMATIONS:
            return {
                ...state,
                confirmations: action.payload.confirmations
            }
        case POLL_FOR_CONFIRMATIONS_ERROR:
            return {
                ...state,
                pollForConfirmationsError: action.payload.pollForConfirmationsError
            }
        default:
            return state
    }
}

export default redemption