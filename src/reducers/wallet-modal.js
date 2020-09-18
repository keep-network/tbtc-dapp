import { OPEN_WALLET_MODAL, CLOSE_WALLET_MODAL } from "../actions"

const initialState = {
  isOpen: false,
}

const walletModal = (state = initialState, action) => {
  switch (action.type) {
    case OPEN_WALLET_MODAL:
      return {
        ...state,
        isOpen: true,
      }
    case CLOSE_WALLET_MODAL:
      return {
        ...state,
        isOpen: false,
      }
    default:
      return state
  }
}

export default walletModal
