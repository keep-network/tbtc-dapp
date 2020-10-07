import React from "react"
import { connect } from "react-redux"
import PropTypes from "prop-types"

import ConfirmingBase from "../lib/Confirming"
import { formatSatsToBtc } from "../../utils"
import DepositPage from "./DepositPage"

const Confirming = ({
  signerFee,
  error,
  requiredConfirmations,
  confirmations,
}) => (
  <DepositPage>
    <ConfirmingBase
      className="pay pay-confirming"
      stepStatus="3/5"
      error={error}
      requiredConfirmations={requiredConfirmations}
      confirmations={confirmations}
    >
      <div>
        <p>
          We’ll send you a browser notification when your TBTC is ready to be
          minted.
        </p>
        <p>
          <i>A watched block never boils.</i>
        </p>
      </div>
      <div className="signer-fee">
        <span className="signer-fee-label">Signer Fee: </span>
        {signerFee} BTC*
      </div>
    </ConfirmingBase>
  </DepositPage>
)

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
    stateRestorationError,
  },
}) => {
  return {
    signerFee: formatSatsToBtc(signerFeeInSatoshis),
    error: btcConfirmingError || stateRestorationError,
    requiredConfirmations,
    confirmations,
  }
}

export default connect(mapStateToProps, null)(Confirming)
