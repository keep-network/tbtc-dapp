import { put } from "redux-saga/effects"

export function* logError(errorActionType, error) {
  const { message, stack } = error
  yield put({
    type: errorActionType,
    payload: {
      error: message,
    },
  })
  console.error({
    message,
    originalStack: stack.split("\n").map((s) => s.trim()),
    error,
  })
}
