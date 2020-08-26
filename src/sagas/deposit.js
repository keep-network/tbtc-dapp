import { call, put, select, take, delay, fork } from "redux-saga/effects"
import { eventChannel, END } from "redux-saga"

import { BitcoinHelpers } from "@keep-network/tbtc.js"

import { METAMASK_TX_DENIED_ERROR } from "../chain"

import { notifyTransactionConfirmed } from "../lib/notifications/actions"
import { navigateTo } from "../lib/router/actions"
import { TBTCLoaded } from "../wrappers/web3"
import { logError } from "./lib"
import { resumeRedemption } from "./redemption"

import BN from "bn.js"

/** @typedef { import("@keep-network/tbtc.js").TBTC } TBTC */
/** @typedef { import("@keep-network/tbtc.js").Deposit } Deposit */

export const DEPOSIT_AVAILABLE_LOT_SIZES_REQUESTED =
  "DEPOSIT_AVAILABLE_LOT_SIZES_REQUESTED"
export const DEPOSIT_AVAILABLE_LOT_SIZES_ERROR =
  "DEPOSIT_AVAILABLE_LOT_SIZES_ERROR"
export const DEPOSIT_REQUEST_BEGIN = "DEPOSIT_REQUEST_BEGIN"
export const DEPOSIT_REQUEST_METAMASK_SUCCESS =
  "DEPOSIT_REQUEST_METAMASK_SUCCESS"
export const DEPOSIT_REQUEST_SUCCESS = "DEPOSIT_REQUEST_SUCCESS"
export const DEPOSIT_REQUEST_ERROR = "DEPOSIT_REQUEST_ERROR"
export const DEPOSIT_RESOLVED = "DEPOSIT_RESOLVED"
export const DEPOSIT_BTC_ADDRESS = "DEPOSIT_BTC_ADDRESS"
export const DEPOSIT_BTC_ADDRESS_ERROR = "DEPOSIT_BTC_ADDRESS_ERROR"
export const DEPOSIT_STATE_RESTORED = "DEPOSIT_STATE_RESTORED"
export const DEPOSIT_BTC_AMOUNTS = "DEPOSIT_BTC_AMOUNTS"
export const DEPOSIT_BTC_AMOUNTS_ERROR = "DEPOSIT_BTC_AMOUNTS_ERROR"
export const DEPOSIT_AUTO_SUBMIT_PROOF = "DEPOSIT_AUTO_SUBMIT_PROOF"

export const BTC_TX_SEEN = "BTC_TX_SEEN"
export const BTC_TX_ERROR = "BTC_TX_ERROR"
export const BTC_TX_REQUIRED_CONFIRMATIONS = "BTC_TX_REQUIRED_CONFIRMATIONS"
export const BTC_TX_CONFIRMED_WAIT = "BTC_TX_CONFIRMED_WAIT"
export const BTC_TX_CONFIRMED = "BTC_TX_CONFIRMED"
export const BTC_TX_CONFIRMED_ALL = "BTC_TX_CONFIRMED_ALL"
export const BTC_TX_CONFIRMING_ERROR = "BTC_TX_CONFIRMING_ERROR"

export const DEPOSIT_PROVE_BTC_TX_BEGIN = "DEPOSIT_PROVE_BTC_TX_BEGIN"
export const DEPOSIT_PROVE_BTC_TX_SUCCESS = "DEPOSIT_PROVE_BTC_TX_SUCCESS"
export const DEPOSIT_PROVE_BTC_TX_ERROR = "DEPOSIT_PROVE_BTC_TX_ERROR"
export const DEPOSIT_MINT_TBTC = "DEPOSIT_MINT_TBTC"
export const DEPOSIT_MINT_TBTC_ERROR = "DEPOSIT_MINT_TBTC_ERROR"

function* restoreState(nextStepMap, stateKey) {
  /** @type {TBTC} */
  const tbtc = yield TBTCLoaded

  const depositAddress = yield select((state) => state[stateKey].depositAddress)
  const deposit = yield tbtc.Deposit.withAddress(depositAddress)
  yield put({
    type: DEPOSIT_RESOLVED,
    payload: {
      deposit,
    },
  })

  /** @type {BN} */
  const depositState = yield call([deposit, deposit.getCurrentState])

  let finalCalls = null
  const nextStep = nextStepMap[depositState]

  switch (depositState) {
    case tbtc.Deposit.State.START:
      throw new Error("Unexpected state.")

    case tbtc.Deposit.State.AWAITING_WITHDRAWAL_PROOF:
      finalCalls = resumeRedemption
    // Explicitly fall through.

    case tbtc.Deposit.State.AWAITING_WITHDRAWAL_SIGNATURE:
    case tbtc.Deposit.State.AWAITING_BTC_FUNDING_PROOF:
    case tbtc.Deposit.State.REDEEMED:
    case tbtc.Deposit.State.ACTIVE:
      const btcAddress = yield call([deposit, deposit.getBitcoinAddress])
      yield put({
        type: DEPOSIT_BTC_ADDRESS,
        payload: {
          btcAddress,
        },
      })

      const lotInSatoshis = yield call([deposit, deposit.getLotSizeSatoshis])
      const signerFeeTbtc = yield call([deposit, deposit.getSignerFeeTBTC])
      const signerFeeInSatoshis = signerFeeTbtc.div(tbtc.satoshisPerTbtc)
      yield put({
        type: DEPOSIT_BTC_AMOUNTS,
        payload: {
          lotInSatoshis,
          signerFeeInSatoshis,
        },
      })

      if (finalCalls) {
        yield* finalCalls()
      }

    // FIXME Check to see if Electrum has already seen a tx for payment
    // FIXME and fast-forward to /pay/confirming if so.
    //
    // FIXME Check to see if we have a transaction in the mempool for
    // FIXME submitting funding proof, and update state accordingly.

    // Explicitly fall through.

    case tbtc.Deposit.State.AWAITING_SIGNER_SETUP:
      yield put({
        type: DEPOSIT_STATE_RESTORED,
      })

      const inVendingMachine = yield call([deposit, deposit.inVendingMachine])
      if (depositState === tbtc.Deposit.State.ACTIVE && !inVendingMachine) {
        yield call([deposit, deposit.mintTBTC])
      }

      // TODO Fork on active vs await
      yield put(navigateTo("/deposit/" + depositAddress + nextStep))

      yield* onStateRestored(tbtc, depositState)

      break

    // Funding failure states
    case tbtc.Deposit.State.FRAUD_AWAITING_BTC_FUNDING_PROOF:
    case tbtc.Deposit.State.FAILED_SETUP:
      // TODO Update deposit state to reflect situation.
      break

    default:
      throw new Error(`Unexpected state ${depositState.toNumber()}.`)
  }

  // Here, we need to look at the logs. getDepositBtcAddress submits a
  // signed tx to Metamask, so that's not what we need.
  //
  // Then, we need to dispatch an update to the state.

  // yield put({ type:  })
}

export function* restoreDepositState() {
  /** @type {TBTC} */
  const tbtc = yield TBTCLoaded

  const DEPOSIT_STEP_MAP = {}
  DEPOSIT_STEP_MAP[tbtc.Deposit.State.AWAITING_SIGNER_SETUP] = "/get-address"
  DEPOSIT_STEP_MAP[tbtc.Deposit.State.AWAITING_BTC_FUNDING_PROOF] = "/pay"
  DEPOSIT_STEP_MAP[tbtc.Deposit.State.ACTIVE] = "/congratulations"

  yield* restoreState(DEPOSIT_STEP_MAP, "deposit")
}

export function* restoreRedemptionState() {
  /** @type {TBTC} */
  const tbtc = yield TBTCLoaded

  const REDEMPTION_STEP_MAP = {}
  REDEMPTION_STEP_MAP[tbtc.Deposit.State.AWAITING_BTC_FUNDING_PROOF] = "/pay"
  REDEMPTION_STEP_MAP[tbtc.Deposit.State.ACTIVE] = "/redemption"
  REDEMPTION_STEP_MAP[tbtc.Deposit.State.AWAITING_WITHDRAWAL_SIGNATURE] =
    "/redemption/signing"
  REDEMPTION_STEP_MAP[tbtc.Deposit.State.AWAITING_WITHDRAWAL_PROOF] =
    "/redemption/prove"
  REDEMPTION_STEP_MAP[tbtc.Deposit.State.REDEEMED] =
    "/redemption/congratulations"

  yield* restoreState(REDEMPTION_STEP_MAP, "redemption")
}

export function* onStateRestored(tbtc, depositState) {
  switch (depositState) {
    case tbtc.Deposit.State.AWAITING_SIGNER_SETUP:
      yield* getBitcoinAddress()
      break
    case tbtc.Deposit.State.AWAITING_BTC_FUNDING_PROOF:
      yield* autoSubmitDepositProof()
      break
    case tbtc.Deposit.State.AWAITING_WITHDRAWAL_SIGNATURE:
      yield* resumeRedemption()
      break
    default:
      // noop
      break
  }
}

export function* requestAvailableLotSizes() {
  /** @type {TBTC} */
  const tbtc = yield TBTCLoaded

  try {
    const availableLotSizes = yield call([
      tbtc.Deposit,
      tbtc.Deposit.availableSatoshiLotSizes,
    ])
    yield put({
      type: DEPOSIT_AVAILABLE_LOT_SIZES_REQUESTED,
      payload: {
        availableLotSizes,
      },
    })
  } catch (error) {
    yield* logError(DEPOSIT_AVAILABLE_LOT_SIZES_ERROR, error)
  }
}

export function* requestADeposit() {
  /** @type {TBTC} */
  const tbtc = yield TBTCLoaded

  // call Keep to request a deposit
  yield put({ type: DEPOSIT_REQUEST_BEGIN })

  /** @type {Deposit} */
  let deposit
  try {
    const lotSizeInBtc = yield select((state) => state.deposit.lotSize)

    // If lot size is null, redirect user to start over
    if (!lotSizeInBtc) {
      yield put(navigateTo("/deposit"))
      return
    }

    const lotSizeInSatoshis = new BN(
      lotSizeInBtc * BitcoinHelpers.satoshisPerBtc.toNumber()
    )

    deposit = yield call(
      [tbtc.Deposit, tbtc.Deposit.withSatoshiLotSize],
      lotSizeInSatoshis
    )
  } catch (error) {
    if (error.message.includes(METAMASK_TX_DENIED_ERROR)) return
    yield* logError(DEPOSIT_REQUEST_ERROR, error)
    return
  }
  yield put({ type: DEPOSIT_REQUEST_METAMASK_SUCCESS })

  yield put({
    type: DEPOSIT_REQUEST_SUCCESS,
    payload: {
      depositAddress: deposit.address,
    },
  })

  // goto
  yield put(navigateTo("/deposit/" + deposit.address + "/get-address"))

  yield put({
    type: DEPOSIT_RESOLVED,
    payload: {
      deposit,
    },
  })

  yield* getBitcoinAddress()
}

export function* getBitcoinAddress() {
  /** @type {TBTC} */
  const tbtc = yield TBTCLoaded

  /** @type Deposit */
  const deposit = yield select((state) => state.deposit.deposit)

  try {
    const btcAddress = yield deposit.bitcoinAddress
    yield put({
      type: DEPOSIT_BTC_ADDRESS,
      payload: {
        btcAddress,
      },
    })
  } catch (error) {
    yield* logError(DEPOSIT_BTC_ADDRESS_ERROR, error)
    return
  }

  try {
    const lotInSatoshis = yield call([deposit, deposit.getLotSizeSatoshis])
    const signerFeeTbtc = yield call([deposit, deposit.getSignerFeeTBTC])
    const signerFeeInSatoshis = signerFeeTbtc.div(tbtc.satoshisPerTbtc)
    yield put({
      type: DEPOSIT_BTC_AMOUNTS,
      payload: {
        lotInSatoshis,
        signerFeeInSatoshis,
      },
    })
  } catch (error) {
    yield* logError(DEPOSIT_BTC_AMOUNTS_ERROR, error)
    return
  }

  // goto
  yield put(navigateTo("/deposit/" + deposit.address + "/pay"))
  yield* autoSubmitDepositProof()
}

function createConfirmationChannel(deposit) {
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

    deposit.onReceivedFundingConfirmation(listener)

    // no-op
    // eventChannel subscriber must return an unsubscribe, but tbtc.js does not
    // currently provide one
    return () => {}
  })
}

function* watchForFundingConfirmations(deposit) {
  yield delay(500)

  const confirmationChannel = yield call(createConfirmationChannel, deposit)
  try {
    while (true) {
      const { transactionID, confirmations } = yield take(confirmationChannel)
      yield delay(50)
      if (confirmations) {
        yield put({
          type: BTC_TX_CONFIRMED,
          payload: { btcConfirmedTxID: transactionID, confirmations },
        })
      }
    }
  } finally {
    console.debug("And now, the watch has ended")
  }
}

export function* autoSubmitDepositProof() {
  /** @type Deposit */
  const deposit = yield select((state) => state.deposit.deposit)
  const didSubmitDepositProof = yield select(
    (state) => state.deposit.didSubmitDepositProof
  )

  if (didSubmitDepositProof) {
    return
  }

  const autoSubmission = deposit.autoSubmit()

  yield put({ type: DEPOSIT_AUTO_SUBMIT_PROOF })

  yield fork(watchForFundingConfirmations, deposit)

  try {
    const fundingTx = yield autoSubmission.fundingTransaction

    yield put({
      // Tx seen in mempool
      type: BTC_TX_SEEN,
      payload: {
        btcDepositedTxID: fundingTx.transactionID,
        fundingOutputIndex: fundingTx.outputPosition,
      },
    })
  } catch (error) {
    yield* logError(BTC_TX_ERROR, error)
    return
  }

  // wait a certain number of confirmations on this step
  yield put({
    type: BTC_TX_CONFIRMED_WAIT,
  })

  // goto
  yield put(navigateTo("/deposit/" + deposit.address + "/pay/confirming"))

  try {
    const requiredConfirmations = yield deposit.requiredConfirmations
    yield put({
      type: BTC_TX_REQUIRED_CONFIRMATIONS,
      payload: {
        requiredConfirmations,
      },
    })

    const confirmations = yield autoSubmission.fundingConfirmations

    yield put({
      type: BTC_TX_CONFIRMED_ALL,
      payload: {
        btcConfirmedTxID: confirmations.transaction.transactionID,
      },
    })
  } catch (error) {
    yield* logError(BTC_TX_CONFIRMING_ERROR, error)
    return
  }

  // emit a notification
  // FIXME This should be a reducer on BTC_TX_CONFIRMED.
  yield put(notifyTransactionConfirmed())

  // goto
  yield put(navigateTo("/deposit/" + deposit.address + "/prove"))

  try {
    yield put({ type: DEPOSIT_PROVE_BTC_TX_BEGIN })
    const proofTransaction = yield autoSubmission.proofTransaction

    yield put({
      type: DEPOSIT_PROVE_BTC_TX_SUCCESS,
      payload: {
        proofTransaction,
      },
    })
  } catch (error) {
    yield* logError(DEPOSIT_PROVE_BTC_TX_ERROR, error)
    return
  }

  try {
    yield put({ type: DEPOSIT_MINT_TBTC })
    yield call([deposit, deposit.mintTBTC])
  } catch (error) {
    yield* logError(DEPOSIT_MINT_TBTC_ERROR, error)
    return
  }

  // goto
  yield put(navigateTo("/deposit/" + deposit.address + "/congratulations"))
}
