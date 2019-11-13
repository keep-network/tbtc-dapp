import {
    UPDATE_ADDRESSES,
    UPDATE_TRANSACTION_AND_SIGNATURE,
    UPDATE_TX_HASH,
    UPDATE_CONFIRMATIONS,
    POLL_FOR_CONFIRMATIONS_ERROR,
    REDEMPTION_PROVE_BTC_TX_BEGIN,
    REDEMPTION_PROVE_BTC_TX_SUCCESS,
    REDEMPTION_PROVE_BTC_TX_ERROR
} from '../sagas/redemption'

const initialState = {
    btcAddress: null,
    depositAddress: null,
    transaction: null,
    txHash: null,
    requiredConfirmations: 6,
    confirmations: null,
    pollForConfirmationsError: null
}

const redemption = (state = initialState, action) => {
    switch (action.type) {
        case UPDATE_ADDRESSES:
            return {
                ...state,
                btcAddress: action.payload.btcAddress,
                depositAddress: action.payload.depositAddress
            }
        case UPDATE_TRANSACTION_AND_SIGNATURE:
            return {
                ...state,
                transaction: action.payload.transaction,
                signature: action.payload.signature
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
        case REDEMPTION_PROVE_BTC_TX_BEGIN:
            return {
            ...state,
            provingRedemption: true,
            proveRedemptionError: undefined
            }
        case REDEMPTION_PROVE_BTC_TX_SUCCESS:
            return {
            ...state,
            provingRedemption: false,
            proveRedemptionError: undefined
            }
        case REDEMPTION_PROVE_BTC_TX_ERROR:
            return {
            ...state,
            provingRedemption: false,
            proveRedemptionError: action.payload.error
            }
        default:
            return state
    }
}

export default redemption