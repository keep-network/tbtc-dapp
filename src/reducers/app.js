import {
  DEPOSIT_REQUEST_SUCCESS,
  DEPOSIT_BTC_ADDRESS,
  BTC_TX_MINED,
  BTC_TX_CONFIRMED_WAIT,
  DEPOSIT_PROVE_BTC_TX_SUCCESS
} from "../sagas"

const intialState = {
  btcAddress: null,
  depositAddress: null,
  btcDepositedTxid: null,
  tbtcMintedTxId: null,
  fundingOutputIndex: null,
  btcConfirming: false
}

const app = (state = intialState, action) => {
  switch (action.type) {
    case DEPOSIT_REQUEST_SUCCESS:
      return {
        ...state,
        depositAddress: action.payload.depositAddress
      }
    case DEPOSIT_BTC_ADDRESS:
      return {
        ...state,
        btcAddress: action.payload.btcAddress
      }
    case BTC_TX_MINED:
      return {
        ...state,
        btcDepositedTxid: action.payload.btcDepositedTxid,
        fundingOutputIndex: action.payload.fundingOutputIndex
      }
    case BTC_TX_CONFIRMED_WAIT:
      return {
        ...state,
        btcConfirming: true,

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
