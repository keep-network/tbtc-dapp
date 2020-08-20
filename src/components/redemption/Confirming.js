import React from "react"
import { connect } from "react-redux"
import PropTypes from "prop-types"

import Description from "../lib/Description"
import StatusIndicator from "../svgs/StatusIndicator"

const Confirming = ({ txHash, btcNetwork, error }) => {
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
          <p>We&apos;re waiting to confirm your transaction.</p>
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
}

const mapStateToProps = (state) => {
  return {
    txHash: state.redemption.txHash,
    error: state.redemption.pollForConfirmationsError,
    btcNetwork: state.tbtc.btcNetwork,
  }
}

export default connect(mapStateToProps)(Confirming)
