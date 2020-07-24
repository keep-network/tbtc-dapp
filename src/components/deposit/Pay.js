import React from 'react'
import { connect } from 'react-redux'

import { useParams } from "react-router-dom"

import StatusIndicator from '../svgs/StatusIndicator'
import CopyAddressField from '../lib/CopyAddressField'
import Description from "../lib/Description"

import { formatSatsToBtc } from '../../utils'

function Pay(props) {
  const params = useParams()
  return <PayComponent {...props} address={props.address || params.address} />
}

const PayComponent = ({ btcAddress, btcAmount, signerFee, error }) => {
  const btcURL =
    `bitcoin:${btcAddress}?amount=${btcAmount}&label=Single-Use+tBTC+Deposit+Wallet`

  return (
    <div className="pay">
      <div className="page-top">
        <StatusIndicator />
      </div>
      <div className="page-body">
        <div className="step">
          Step 2/5
        </div>
        <div className="title">
          Pay: {btcAmount} BTC
        </div>
        <hr />
        <Description error={error}>
          <div>
            Scan the QR code or click to copy the address below into your wallet.
          </div>
          <div className="signer-fee">
            <span className="signer-fee-label">Signer Fee: </span>
            {signerFee} BTC*
          </div>
          <CopyAddressField address={btcAddress} qrCodeUrl={btcURL} />
        </Description>
      </div>
    </div>
  )
}

const mapStateToProps = (state) => {
  const {
    btcAddress,
    lotInSatoshis,
    signerFeeInSatoshis,
    btcTxError
  } = state.deposit

  return {
    btcAddress,
    btcAmount: formatSatsToBtc(lotInSatoshis),
    signerFee: formatSatsToBtc(signerFeeInSatoshis),
    error: btcTxError,
  }
}

export default connect(
  mapStateToProps,
  null
)(Pay)
