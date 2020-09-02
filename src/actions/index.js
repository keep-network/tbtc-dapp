// Account setup.
export const SET_ETHEREUM_ACCOUNT = "SET_ETHEREUM_ACCOUNT"

export function setEthereumAccount(account) {
  return {
    type: SET_ETHEREUM_ACCOUNT,
    payload: {
      account,
    },
  }
}

// Web3/TBTC Initialization
export const TBTC_LOADED = "TBTC_LOADED"

export function tbtcLoaded(chainId, btcNetwork) {
  return {
    type: TBTC_LOADED,
    payload: {
      chainId,
      btcNetwork,
    },
  }
}

// State restoration.
export const RESTORE_DEPOSIT_STATE = "RESTORE_DEPOSIT_STATE"
export const RESTORE_REDEMPTION_STATE = "RESTORE_REDEMPTION_STATE"

export function restoreDepositState(depositAddress) {
  return {
    type: RESTORE_DEPOSIT_STATE,
    payload: {
      depositAddress: depositAddress,
    },
  }
}

export function restoreRedemptionState(depositAddress) {
  return {
    type: RESTORE_REDEMPTION_STATE,
    payload: {
      depositAddress: depositAddress,
    },
  }
}

// Deposit
export const REQUEST_A_DEPOSIT = "REQUEST_A_DEPOSIT"

export function requestADeposit() {
  return {
    type: REQUEST_A_DEPOSIT,
  }
}

export const REQUEST_AVAILABLE_LOT_SIZES = "REQUEST_AVAILABLE_LOT_SIZES"

export function requestAvailableLotSizes() {
  return {
    type: REQUEST_AVAILABLE_LOT_SIZES,
  }
}

export const SELECT_LOT_SIZE = "SELECT_LOT_SIZE"

export function selectLotSize(lotSize) {
  return {
    type: SELECT_LOT_SIZE,
    payload: {
      lotSize,
    },
  }
}

// Redemption
export const SAVE_ADDRESSES = "SAVE_ADDRESSES"
export const REQUEST_REDEMPTION = "REQUEST_REDEMPTION"

export function saveAddresses({ btcAddress, depositAddress }) {
  return {
    type: SAVE_ADDRESSES,
    payload: {
      btcAddress,
      depositAddress,
    },
  }
}

export function requestRedemption() {
  return {
    type: REQUEST_REDEMPTION,
  }
}

// Modal
export const OPEN_MODAL = "OPEN_MODAL"
export const CLOSE_MODAL = "CLOSE_MODAL"
export const SET_RENDER_CONTENT = "SET_RENDER_CONTENT"

export function openModal() {
  return {
    type: OPEN_MODAL,
  }
}

export function closeModal() {
  return {
    type: CLOSE_MODAL,
  }
}

export function setRenderContent(renderContent) {
  return {
    type: SET_RENDER_CONTENT,
    payload: {
      renderContent,
    },
  }
}
