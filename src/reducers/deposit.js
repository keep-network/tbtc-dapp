import {
  DEPOSIT_REQUEST_SUCCESS,
  DEPOSIT_BTC_ADDRESS,
  BTC_TX_MINED,
  BTC_TX_CONFIRMED_WAIT,
  DEPOSIT_PROVE_BTC_TX_BEGIN,
  DEPOSIT_PROVE_BTC_TX_SUCCESS,
  DEPOSIT_PROVE_BTC_TX_ERROR,
  DEPOSIT_REQUEST_BEGIN,
  DEPOSIT_PUBKEY_PUBLISHED
} from "../sagas/deposit"

const intialState = {
  btcAddress: null,
  depositAddress: null,
  btcDepositedTxID: null,
  tbtcMintedTxID: null,
  fundingOutputIndex: null,
  btcConfirming: false,
  invoiceStatus: 0
}

const deposit = (state = intialState, action) => {
  switch (action.type) {
    case DEPOSIT_REQUEST_BEGIN:
      return {
        ...state,
        invoiceStatus: 1
      }
    case DEPOSIT_REQUEST_SUCCESS:
      return {
        ...state,
        depositAddress: action.payload.depositAddress,
        invoiceStatus: 2
      }
    case DEPOSIT_PUBKEY_PUBLISHED:
      return {
        ...state,
        invoiceStatus: 3
      }
    case DEPOSIT_BTC_ADDRESS:
      return {
        ...state,
        btcAddress: action.payload.btcAddress
      }
    case BTC_TX_MINED:
      return {
        ...state,
        btcDepositedTxID: action.payload.btcDepositedTxID,
        fundingOutputIndex: action.payload.fundingOutputIndex
      }
    case BTC_TX_CONFIRMED_WAIT:
      return {
        ...state,
        btcConfirming: true
      }
    case DEPOSIT_PROVE_BTC_TX_BEGIN:
      return {
        ...state,
        provingDeposit: true,
        proveDepositError: undefined
      }
    case DEPOSIT_PROVE_BTC_TX_SUCCESS:
      return {
        ...state,
        tbtcMintedTxID: action.payload.tbtcMintedTxID,
        provingDeposit: false,
        proveDepositError: undefined
      }
    case DEPOSIT_PROVE_BTC_TX_ERROR:
      return {
        ...state,
        provingDeposit: false,
        proveDepositError: action.payload.error
      }
    default:
      return state
  }
}

export default deposit
