import React from "react"
import { connect } from "react-redux"
import PropTypes from "prop-types"

import Description from "../lib/Description"
import StatusIndicator from "../svgs/StatusIndicator"
import { formatSatsToBtc } from "../../utils"

const Confirming = ({
  signerFee,
  error,
  requiredConfirmations,
  confirmations,
}) => {
  return (
    <div className="pay pay-confirming">
      <div className="page-top">
        <StatusIndicator pulse />
      </div>
      <div className="page-body">
        <div className="step">Step 3/5</div>
        <div className="title">
          {error ? "Error confirming transaction" : "Confirming..."}
        </div>
        <hr />
        <Description error={error}>
          <div>
            Waiting for {requiredConfirmations} transaction{" "}
            {`confirmation${requiredConfirmations > 1 ? "s" : ""}`}. We’ll send
            you a browser notification when your TBTC is ready to be minted.
            <p>
              {confirmations} / {requiredConfirmations} blocks confirmed
            </p>
            <p>
              <i>A watched block never boils.</i>
            </p>
          </div>
          <div className="signer-fee">
            <span className="signer-fee-label">Signer Fee: </span>
            {signerFee} BTC*
          </div>
        </Description>
      </div>
    </div>
  )
}

Confirming.propTypes = {
  signerFee: PropTypes.string,
  error: PropTypes.string,
  requiredConfirmations: PropTypes.number,
  confirmations: PropTypes.number,
}

const mapStateToProps = ({
  deposit: {
    signerFeeInSatoshis,
    btcConfirmingError,
    requiredConfirmations,
    confirmations,
  },
}) => {
  return {
    signerFee: formatSatsToBtc(signerFeeInSatoshis),
    error: btcConfirmingError,
    requiredConfirmations,
    confirmations,
  }
}

export default connect(mapStateToProps, null)(Confirming)
