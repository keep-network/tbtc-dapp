import {
  DEPOSIT_REQUEST_SUCCESS,
  DEPOSIT_REQUEST_ERROR,
  DEPOSIT_BTC_ADDRESS,
  DEPOSIT_BTC_ADDRESS_ERROR,
  DEPOSIT_BTC_AMOUNTS,
  DEPOSIT_BTC_AMOUNTS_ERROR,
  BTC_TX_SEEN,
  BTC_TX_ERROR,
  BTC_TX_CONFIRMED_WAIT,
  BTC_TX_REQUIRED_CONFIRMATIONS,
  BTC_TX_CONFIRMED,
  BTC_TX_CONFIRMED_ALL,
  BTC_TX_CONFIRMING_ERROR,
  DEPOSIT_AUTO_SUBMIT_PROOF,
  DEPOSIT_PROVE_BTC_TX_BEGIN,
  DEPOSIT_PROVE_BTC_TX_SUCCESS,
  DEPOSIT_PROVE_BTC_TX_ERROR,
  DEPOSIT_MINT_TBTC_ERROR,
  DEPOSIT_REQUEST_BEGIN,
  DEPOSIT_RESOLVED,
  DEPOSIT_STATE_RESTORED,
  DEPOSIT_AVAILABLE_LOT_SIZES_REQUESTED,
  DEPOSIT_AVAILABLE_LOT_SIZES_ERROR,
} from "../sagas/deposit"
import { RESTORE_DEPOSIT_STATE, SELECT_LOT_SIZE } from "../actions"

const initialState = {
  btcAddress: null,
  depositAddress: null,
  didSubmitDepositProof: false,
  btcDepositedTxID: null,
  tbtcMintedTxID: null,
  fundingOutputIndex: null,
  btcConfirming: false,
  btcConfirmingTxID: null,
  requiredConfirmations: 1,
  confirmations: 0,
  invoiceStatus: 0,
  isStateReady: false,
  lotSize: null,
  availableLotSizes: [],
}

const deposit = (state = initialState, action) => {
  switch (action.type) {
    case RESTORE_DEPOSIT_STATE:
      return {
        ...state,
        depositAddress: action.payload.depositAddress,
      }
    case DEPOSIT_STATE_RESTORED:
      return {
        ...state,
        isStateReady: true,
      }
    case DEPOSIT_AVAILABLE_LOT_SIZES_REQUESTED:
      return {
        ...state,
        availableLotSizes: action.payload.availableLotSizes,
      }
    case DEPOSIT_AVAILABLE_LOT_SIZES_ERROR:
      return {
        ...state,
        lotSizeError: action.payload.error,
      }
    case SELECT_LOT_SIZE:
      return {
        ...state,
        lotSize: action.payload.lotSize,
      }
    case DEPOSIT_REQUEST_BEGIN:
      return {
        ...state,
        invoiceStatus: 1,
      }
    case DEPOSIT_REQUEST_SUCCESS:
      return {
        ...state,
        depositAddress: action.payload.depositAddress,
        invoiceStatus: 2,
        isStateReady: true,
      }
    case DEPOSIT_REQUEST_ERROR:
      return {
        ...state,
        requestDepositError: action.payload.error,
      }
    case DEPOSIT_RESOLVED:
      return {
        ...state,
        deposit: action.payload.deposit,
        invoiceStatus: 3,
      }
    case DEPOSIT_BTC_ADDRESS:
      return {
        ...state,
        btcAddress: action.payload.btcAddress,
        btcAddressError: undefined,
      }
    case DEPOSIT_BTC_ADDRESS_ERROR:
    case DEPOSIT_BTC_AMOUNTS_ERROR:
      return {
        ...state,
        btcAddressError: action.payload.error,
      }
    case DEPOSIT_BTC_AMOUNTS:
      return {
        ...state,
        lotInSatoshis: action.payload.lotInSatoshis,
        signerFeeInSatoshis: action.payload.signerFeeInSatoshis,
      }
    case DEPOSIT_AUTO_SUBMIT_PROOF:
      return {
        ...state,
        didSubmitDepositProof: true,
      }
    case BTC_TX_SEEN:
      return {
        ...state,
        btcDepositedTxID: action.payload.btcDepositedTxID,
        fundingOutputIndex: action.payload.fundingOutputIndex,
      }
    case BTC_TX_ERROR:
      return {
        ...state,
        btcTxError: action.payload.error,
      }
    case BTC_TX_CONFIRMED_WAIT:
      return {
        ...state,
        btcConfirming: true,
      }
    case BTC_TX_REQUIRED_CONFIRMATIONS:
      return {
        ...state,
        requiredConfirmations: action.payload.requiredConfirmations,
      }
    case BTC_TX_CONFIRMED:
      return {
        ...state,
        btcConfirmingTxID: action.payload.btcConfirmingTxID,
        confirmations: action.payload.confirmations,
      }
    case BTC_TX_CONFIRMED_ALL:
      return {
        ...state,
        btcConfirmingTxID: action.payload.btcConfirmingTxID,
      }
    case BTC_TX_CONFIRMING_ERROR:
      return {
        ...state,
        btcConfirmingError: action.payload.error,
      }
    case DEPOSIT_PROVE_BTC_TX_BEGIN:
      return {
        ...state,
        provingDeposit: true,
        proveDepositError: undefined,
      }
    case DEPOSIT_PROVE_BTC_TX_SUCCESS:
      return {
        ...state,
        tbtcMintedTxID: action.payload.tbtcMintedTxID,
        provingDeposit: false,
        proveDepositError: undefined,
      }
    case DEPOSIT_PROVE_BTC_TX_ERROR:
    case DEPOSIT_MINT_TBTC_ERROR:
      return {
        ...state,
        provingDeposit: false,
        proveDepositError: action.payload.error,
      }
    default:
      return state
  }
}

export default deposit
