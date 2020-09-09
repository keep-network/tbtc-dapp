import { put, call, delay, take } from "redux-saga/effects"
import { eventChannel, END } from "redux-saga"

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

export function createConfirmationChannel(flow, onConfirmed) {
  return eventChannel((emit) => {
    const listener = ({
      transactionID,
      confirmations,
      requiredConfirmations,
    }) => {
      emit({ transactionID, confirmations, requiredConfirmations })

      // Close channel once we have all the required confirmations
      if (confirmations === requiredConfirmations) {
        emit(END)
      }
    }

    flow[onConfirmed](listener)

    // no-op
    // eventChannel subscriber must return an unsubscribe, but tbtc.js does not
    // currently provide one
    return () => {}
  })
}

export function* watchForConfirmations(flow, onConfirmed, confirmedActionType) {
  const confirmationChannel = yield call(
    createConfirmationChannel,
    flow,
    onConfirmed
  )
  try {
    while (true) {
      const { transactionID, confirmations } = yield take(confirmationChannel)
      yield delay(50)
      if (confirmations) {
        yield put({
          type: confirmedActionType,
          payload: { btcConfirmedTxID: transactionID, confirmations },
        })
      }
    }
  } finally {
    console.debug("And now, the watch has ended")
  }
}
