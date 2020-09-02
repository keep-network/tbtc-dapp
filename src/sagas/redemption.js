import { TBTCLoaded } from "../wrappers/web3"
/** @typedef { import("@keep-network/tbtc.js").TBTC } TBTC */
/** @typedef { import("@keep-network/tbtc.js").Redemption } Redemption */
/** @typedef { import("@keep-network/tbtc.js").Deposit } Deposit */

import { call, put, select, take, delay, fork } from "redux-saga/effects"
import { eventChannel, END } from "redux-saga"

import { navigateTo } from "../lib/router/actions"
import { DEPOSIT_RESOLVED } from "./deposit"
import { logError } from "./lib"

export const UPDATE_ADDRESSES = "UPDATE_ADDRESSES"
export const UPDATE_TX_HASH = "UPDATE_TX_HASH"
export const SIGN_TX_ERROR = "SIGN_TX_ERROR"
export const REDEMPTION_REQUIRED_CONFIRMATIONS =
  "REDEMPTION_REQUIRED_CONFIRMATIONS"
export const REDEMPTION_CONFIRMATION = "REDEMPTION_CONFIRMATION"
export const REDEMPTION_CONFIRMATION_ERROR = "REDEMPTION_CONFIRMATION_ERROR"
export const REDEMPTION_REQUESTED = "REDEMPTION_REQUESTED"
export const REDEMPTION_REQUEST_ERROR = "REDEMPTION_REQUEST_ERROR"
export const REDEMPTION_PROVE_BTC_TX_BEGIN = "REDEMPTION_PROVE_BTC_TX_BEGIN"
export const REDEMPTION_PROVE_BTC_TX_SUCCESS = "REDEMPTION_PROVE_BTC_TX_SUCCESS"
export const REDEMPTION_PROVE_BTC_TX_ERROR = "REDEMPTION_PROVE_BTC_TX_ERROR"

export function* saveAddresses({ payload }) {
  yield put({
    type: UPDATE_ADDRESSES,
    payload,
  })

  /** @type {TBTC} */
  const tbtc = yield TBTCLoaded

  const deposit = yield call(
    [tbtc.Deposit, tbtc.Deposit.withAddress],
    payload.depositAddress
  )

  yield put({
    type: DEPOSIT_RESOLVED,
    payload: {
      deposit,
    },
  })

  yield put(navigateTo("/deposit/" + payload.depositAddress + "/redemption"))
}

export function* requestRedemption() {
  /** @type Deposit */
  const deposit = yield select((state) => state.redemption.deposit)
  /** @type string */
  const btcAddress = yield select((state) => state.redemption.btcAddress)

  try {
    /** @type {Redemption} */
    const redemption = yield call(
      [deposit, deposit.requestRedemption],
      btcAddress
    )
    yield put({
      type: REDEMPTION_REQUESTED,
      payload: {
        redemption,
      },
    })

    yield* runRedemption(redemption)
  } catch (error) {
    yield* logError(REDEMPTION_REQUEST_ERROR, error)
  }
}

export function* resumeRedemption() {
  /** @type {Deposit} */
  const deposit = yield select((state) => state.redemption.deposit)
  const existingRedemption = yield select(
    (state) => state.redemption.redemption
  )
  if (existingRedemption) {
    return // just one at a time please; FIXME should be handled better
  }

  try {
    const redemption = yield call([deposit, deposit.getCurrentRedemption])

    yield put({
      type: REDEMPTION_REQUESTED,
      payload: {
        redemption,
      },
    })

    yield* runRedemption(redemption)
  } catch (error) {
    yield* logError(REDEMPTION_REQUEST_ERROR, error)
  }
}

function createConfirmationChannel(redemption) {
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

    redemption.onReceivedConfirmation(listener)

    // no-op
    // eventChannel subscriber must return an unsubscribe, but tbtc.js does not
    // currently provide one
    return () => {}
  })
}

function* watchForConfirmations(redemption) {
  yield delay(500)

  const confirmationChannel = yield call(createConfirmationChannel, redemption)
  try {
    while (true) {
      const { confirmations } = yield take(confirmationChannel)
      yield delay(50)
      if (confirmations) {
        yield put({
          type: REDEMPTION_CONFIRMATION,
          payload: { confirmations },
        })
      }
    }
  } finally {
    console.debug("And now, the watch has ended")
  }
}

/**
 * @param {Redemption} redemption
 */
function* runRedemption(redemption) {
  const autoSubmission = redemption.autoSubmit()
  const depositAddress = redemption.deposit.address

  yield fork(watchForConfirmations, redemption)

  yield put(navigateTo("/deposit/" + depositAddress + "/redemption/signing"))

  try {
    const txHash = yield autoSubmission.broadcastTransactionID
    yield put({
      type: UPDATE_TX_HASH,
      payload: {
        txHash,
      },
    })

    const requiredConfirmations = yield redemption.deposit.requiredConfirmations
    yield put({
      type: REDEMPTION_REQUIRED_CONFIRMATIONS,
      payload: {
        requiredConfirmations,
      },
    })

    yield put(
      navigateTo("/deposit/" + depositAddress + "/redemption/confirming")
    )
  } catch (error) {
    yield* logError(SIGN_TX_ERROR, error)
    return
  }

  try {
    yield autoSubmission.confirmations

    yield put(navigateTo("/deposit/" + depositAddress + "/redemption/prove"))
  } catch (error) {
    yield* logError(REDEMPTION_CONFIRMATION_ERROR, error)
    return
  }

  try {
    yield put({ type: REDEMPTION_PROVE_BTC_TX_BEGIN })
    yield autoSubmission.proofTransaction

    yield put({ type: REDEMPTION_PROVE_BTC_TX_SUCCESS })

    yield put(
      navigateTo("/deposit/" + depositAddress + "/redemption/congratulations")
    )
  } catch (error) {
    yield* logError(REDEMPTION_PROVE_BTC_TX_ERROR, error)
  }
}
