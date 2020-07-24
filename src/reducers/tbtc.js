import { TBTC_LOADED } from '../actions/index.js'

const initialState = {
  web3: {
    chainId: null,
  },
  btcNetwork: null,
}

const tbtc = (state = initialState, action) => {
  switch (action.type) {
    case TBTC_LOADED:
      return {
        web3: {
          chainId: action.payload.chainId,
        },
        btcNetwork: action.payload.btcNetwork,
      }

    default:
      return state
  }
}

export default tbtc
