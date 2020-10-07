import React from "react"
import { connect } from "react-redux"
import PropTypes from "prop-types"

import { useParams } from "react-router-dom"

import StatusIndicator from "../svgs/StatusIndicator"
import CopyAddressField from "../lib/CopyAddressField"
import Description from "../lib/Description"
import DepositPage from "./DepositPage"

import { formatSatsToBtc } from "../../utils"

function Pay(props) {
  const params = useParams()
  return <PayComponent {...props} address={props.address || params.address} />
}

Pay.propTypes = {
  address: PropTypes.string,
}

const PayComponent = ({ btcAddress, btcAmount, signerFee, error }) => {
  const btcURL = `bitcoin:${btcAddress}?amount=${btcAmount}&label=Single-Use+tBTC+Deposit+Wallet`

  return (
    <DepositPage className="pay">
      <div className="page-top">
        <StatusIndicator />
      </div>
      <div className="page-body">
        <div className="step">Step 2/5</div>
        <div className="title">Pay EXACTLY: {btcAmount} BTC</div>
        <hr />
        <Description error={error}>
          <div className="warning">
            <p>To avoid loss of funds, do NOT fund from an exchange.</p>

            <p>
              Exchanges transfers can result in Bitcoin transactions that cannot
              be proven on Ethereum. If you have BTC in an exchange, transfer
              through an intermediary wallet and make a single transaction to
              the deposit&apos;s funding address.
            </p>
          </div>
          <div>
            Scan the QR code or click to copy the address below into your
            wallet.
          </div>
          <div className="signer-fee">
            <span className="signer-fee-label">Signer Fee: </span>
            {signerFee} BTC*
          </div>
          <CopyAddressField address={btcAddress} qrCodeUrl={btcURL} />
        </Description>
      </div>
    </DepositPage>
  )
}

PayComponent.propTypes = {
  btcAddress: PropTypes.string,
  btcAmount: PropTypes.string,
  signerFee: PropTypes.string,
  error: PropTypes.string,
}

const mapStateToProps = (state) => {
  const {
    btcAddress,
    lotInSatoshis,
    signerFeeInSatoshis,
    btcTxError,
    stateRestorationError,
  } = state.deposit

  return {
    btcAddress,
    btcAmount: formatSatsToBtc(lotInSatoshis),
    signerFee: formatSatsToBtc(signerFeeInSatoshis),
    error: btcTxError || stateRestorationError,
  }
}

export default connect(mapStateToProps, null)(Pay)
