import React, { Component } from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'

import { autoSubmitDepositProof } from '../../actions'
import StatusIndicator from '../svgs/StatusIndicator'
import { useParams } from "react-router-dom"

import { BitcoinHelpers } from '@keep-network/tbtc.js'

import BigNumber from "bignumber.js"
BigNumber.set({ DECIMAL_PLACES: 8 })

function GetAddress(props) {
  const params = useParams()
  return <GetAddressComponent {...props} address={props.address || params.address} />
}

class GetAddressComponent extends Component {
  state = {
    deposit: {
      depositAddress: this.props.address
    }
  }

  componentDidMount() {
    const { autoSubmitDepositProof } = this.props

    autoSubmitDepositProof()
  }

  render() {
    const { lotInSatoshis, signerFeeInSatoshis, depositAddress } = this.props
    const lotInBtc = (new BigNumber(lotInSatoshis.toString())).div(BitcoinHelpers.satoshisPerBtc.toString())
    const signerFeeInBtc = (new BigNumber(signerFeeInSatoshis.toString())).div(BitcoinHelpers.satoshisPerBtc.toString())

    const btcAmount = lotInBtc.toString()
    const signerFee = signerFeeInBtc.toString()

    return (
      <div className="pay">
        <div className="page-top">
            <StatusIndicator pulse />
        </div>
        <div className="page-body">
          <div className="step">
            Step 2/5
          </div>
          <div className="title">
            Waiting for signers to generate Bitcoin wallet...
          </div>
          <hr />
          <div className="description">
            <p class="warning">
              <strong>Do NOT fund from an exchange.</strong> Exchanges
              transfers can result in transactions that cannot be proven on
              Ethereum. If you have BTC in an exchange, transfer through an
              intermediary wallet and make a single transaction to the
              deposit's funding address.
            </p>

            <div>
              Opening {btcAmount} BTC deposit with address {depositAddress}...
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
}


const mapStateToProps = (state, ownProps) => {
  return {
    depositAddress: state.deposit.depositAddress,
    lotInSatoshis: state.deposit.lotInSatoshis,
    signerFeeInSatoshis: state.deposit.signerFeeInSatoshis,
  }
}

const mapDispatchToProps = (dispatch) => {
  return bindActionCreators(
    {
      autoSubmitDepositProof
    },
    dispatch
  )
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(GetAddress)
