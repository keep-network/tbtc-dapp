import {
    UPDATE_ADDRESSES,
    UPDATE_TX_HASH,
    UPDATE_CONFIRMATIONS,
    POLL_FOR_CONFIRMATIONS_ERROR
} from '../sagas/redemption'

const initialState = {
    btcAddress: null,
    contractAddress: null,
    requiredConfirmations: 6,
    confirmations: 0,
    pollForConfirmationsError: null
}

const redemption = (state = initialState, action) => {
    switch (action.type) {
        case UPDATE_ADDRESSES:
            return {
                ...state,
                btcAddress: action.payload.btcAddress,
                contractAddress: action.payload.contractAddress
            }
        case UPDATE_TX_HASH:
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