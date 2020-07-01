import React from 'react'
import { connect } from 'react-redux'

import StatusIndicator from '../svgs/StatusIndicator'

import { BitcoinHelpers } from '@keep-network/tbtc.js'

import BigNumber from "bignumber.js"
BigNumber.set({ DECIMAL_PLACES: 8 })

const Confirming = ({ signerFeeInSatoshis }) => {
  const signerFee = (new BigNumber(signerFeeInSatoshis.toString()))
    .div(BitcoinHelpers.satoshisPerBtc.toString()).toString()

  return (
    <div className="pay pay-confirming">
      <div className="page-top">
        <StatusIndicator pulse />
      </div>
      <div className="page-body">
        <div className="step">
          Step 3/5
        </div>
        <div className="title">
          Confirming...
        </div>
        <hr />
        <div className="description">
          <div>
            Waiting for transaction confirmations. We’ll send you a browser
            notification when your TBTC is ready to be minted.
            <p><i>A watched block never boils.</i></p>
          </div>
          <div className="custodial-fee">
            <span className="custodial-fee-label">Signer Fee: </span>
            {signerFee} BTC*
          </div>
        </div>
      </div>
    </div>
  )
}

const mapStateToProps = (state) => {
  return {
    signerFeeInSatoshis: state.deposit.signerFeeInSatoshis,
  }
}

export default connect(
  mapStateToProps,
  null
)(Confirming)
