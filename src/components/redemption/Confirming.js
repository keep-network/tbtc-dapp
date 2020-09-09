import React from "react"
import { connect } from "react-redux"
import PropTypes from "prop-types"

import ConfirmingBase from "../lib/Confirming"

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
    <ConfirmingBase
      className="confirming"
      stepStatus="4/6"
      error={error}
      requiredConfirmations={requiredConfirmations}
      confirmations={confirmations}
    >
      {txHash ? (
        <a href={blockExplorerUrl} target="_blank" rel="noopener noreferrer">
          Follow along in block explorer
        </a>
      ) : (
        ""
      )}
    </ConfirmingBase>
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
