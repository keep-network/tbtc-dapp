import { DEPOSIT_BTC_ADDRESS, DEPOSIT_REQUEST_SUCCESS, DEPOSIT_PROVE_BTC_TX_SUCCESS, BTC_TX_CONFIRMED, BTC_TX_CONFIRMED_WAIT, BTC_TX_MINED } from "../sagas";

const intialState = {
  btcAddress: null,
  depositAddress: null,
  btcDepositedTxid: null,
  tbtcMintedTxId: null,
  btcConfirming: false
}

const app = (state = intialState, action) => {
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
    case BTC_TX_CONFIRMED:
      return {
          ...state,
          btcDepositedTxid: action.payload.btcDepositedTxid
      }
    case BTC_TX_CONFIRMED_WAIT:
      return {
          ...state,
          btcConfirming: true
      }
    case DEPOSIT_PROVE_BTC_TX_SUCCESS:
      return {
          ...state,
          tbtcMintedTxId: action.payload.tbtcMintedTxId
      }
    default:
        return state
  }
}

export default app