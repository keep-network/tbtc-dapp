import { OPEN_MODAL, CLOSE_MODAL } from "../actions";

const intialState = {
  renderModal: undefined
}

const modal = (state = intialState, action) => {
  switch(action.type) {
    case OPEN_MODAL:
      return {
          renderModal: action.payload.renderModal
      }
    case CLOSE_MODAL:
      return {
          renderModal: undefined
      }
    default:
        return state
  }
}

export default modal