import React, { useEffect } from "react"
import { useParams } from "react-router-dom"
import { bindActionCreators } from "redux"
import { connect, useSelector } from "react-redux"
import { restoreDepositState, restoreRedemptionState } from "../actions"
import { useWeb3React } from "@web3-react/core"

export const RESTORER = {
  DEPOSIT: "deposit",
  REDEMPTION: "redemption",
}

function LoadableBase({
  children,
  restoreDepositState,
  restoreRedemptionState,
  restorer,
  error,
}) {
  // Wait for web3 connected
  const { active: web3Active } = useWeb3React()
  const { address } = useParams()
  const depositStateRestored = useSelector(
    (state) => state[restorer].isStateReady
  )

  useEffect(() => {
    if (web3Active && address && !depositStateRestored) {
      if (restorer === RESTORER.DEPOSIT) {
        restoreDepositState(address)
      } else if (restorer === RESTORER.REDEMPTION) {
        restoreRedemptionState(address)
      } else {
        throw new Error("Unknown restorer.")
      }
    }
  }, [
    web3Active,
    address,
    depositStateRestored,
    restorer,
    restoreDepositState,
    restoreRedemptionState,
  ])

  if (!depositStateRestored) {
    return (
      <div className="pay">
        <div className="page-top">
          {error ? <p className="error">{error}</p> : <p>Loading...</p>}
        </div>
        <div className="page-body"></div>
      </div>
    )
  }

  return children
}

const mapStateToProps = (state) => ({
  error: state.deposit.stateRestorationError,
})

const mapDispatchToProps = (dispatch) => {
  return bindActionCreators(
    {
      restoreDepositState,
      restoreRedemptionState,
    },
    dispatch
  )
}

const Loadable = connect(mapStateToProps, mapDispatchToProps)(LoadableBase)

export default Loadable
