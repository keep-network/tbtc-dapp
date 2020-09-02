import { put } from "redux-saga/effects"

export function* logError(errorActionType, error) {
  const { message, reason, stack } = error
  yield put({
    type: errorActionType,
    payload: {
      error: reason ? `Error: ${reason}` : message,
    },
  })
  console.error({
    reason,
    message,
    originalStack: stack.split("\n").map((s) => s.trim()),
    error,
  })
}
