import { OPEN_MODAL, CLOSE_MODAL, SET_RENDER_CONTENT } from "../actions"

const initialState = {
  isOpen: false,
  renderContent: null,
}

const modal = (state = initialState, action) => {
  switch (action.type) {
    case OPEN_MODAL:
      // console.log("OPEN!")
      return {
        ...state,
        isOpen: true,
      }
    case CLOSE_MODAL:
      return {
        ...state,
        isOpen: false,
      }
    case SET_RENDER_CONTENT:
      // console.log("GOTEM: ", typeof action.payload.renderContent)
      return {
        ...state,
        renderContent: action.payload.renderContent,
      }
    default:
      return state
  }
}

export default modal
