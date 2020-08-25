import { iconPath } from "."
import { NEW_NOTIFICATION } from "./actions"

export default (store) => (next) => (action) => {
  if (window.Notification && action.type === NEW_NOTIFICATION) {
    new window.Notification("tBTC", {
      body: action.payload.body,
      icon: iconPath,
    })
  }

  next(action)
}
