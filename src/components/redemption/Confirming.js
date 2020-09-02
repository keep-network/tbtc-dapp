import React from "react"
import { connect } from "react-redux"
import PropTypes from "prop-types"

import Description from "../lib/Description"
import StatusIndicator from "../svgs/StatusIndicator"

const Confirming = ({
  txHash,
  btcNetwork,
  error,
  requiredConfirmations,
  confirmations,
}) => {
  const blockExplorerUrl = `https://blockstream.info/${
    btcNetwork === "testnet" ? "testnet/" : ""
  }tx/${txHash}`

  return (
    <div className="confirming">
      <div className="page-top">
        <StatusIndicator pulse />
      </div>
      <div className="page-body">
        <div className="step">Step 4/6</div>
        <div className="title">
          {error ? "Error confirming transaction" : "Confirming..."}
        </div>
        <hr />
        <Description error={error}>
          <p>
            Waiting for {requiredConfirmations} transaction{" "}
            {`confirmation${requiredConfirmations > 1 ? "s" : ""}`}.
          </p>
          <p>
            {confirmations} / {requiredConfirmations} blocks confirmed
          </p>
          {txHash ? (
            <a
              href={blockExplorerUrl}
              target="_blank"
              rel="noopener noreferrer"
            >
              Follow along in block explorer
            </a>
          ) : (
            ""
          )}
        </Description>
      </div>
    </div>
  )
}

Confirming.propTypes = {
  txHash: PropTypes.string,
  btcNetwork: PropTypes.string,
  error: PropTypes.string,
  requiredConfirmations: PropTypes.number,
  confirmations: PropTypes.number,
}

const mapStateToProps = (state) => {
  return {
    txHash: state.redemption.txHash,
    error: state.redemption.confirmationError,
    btcNetwork: state.tbtc.btcNetwork,
    requiredConfirmations: state.redemption.requiredConfirmations,
    confirmations: state.redemption.confirmations,
  }
}

export default connect(mapStateToProps)(Confirming)
