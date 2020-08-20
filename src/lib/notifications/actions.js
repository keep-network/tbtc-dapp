export const NEW_NOTIFICATION = "NEW_NOTIFICATION"

export function showNotification(body) {
  return {
    type: NEW_NOTIFICATION,
    payload: {
      body,
    },
  }
}

export function notifyTransactionConfirmed() {
  return showNotification("Bitcoin transaction is confirmed!")
}
