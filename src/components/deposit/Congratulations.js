import React from 'react'
import { connect } from 'react-redux'
import Lottie from 'react-lottie'

import StatusIndicator from '../svgs/StatusIndicator'
import * as animationData from '../animation/tBTC-logo-animate.json'
import { BitcoinHelpers } from '@keep-network/tbtc.js'

import BigNumber from "bignumber.js"
BigNumber.set({ DECIMAL_PLACES: 8 })

const Congratulations = ({ depositAddress, lotInSatoshis, signerFeeInSatoshis }) => {
  const mintedSatoshis = lotInSatoshis.sub(signerFeeInSatoshis)
  const lotInTbtc = (new BigNumber(mintedSatoshis.toString())).div(BitcoinHelpers.satoshisPerBtc.toString())

  return <div className="congratulations">
    <div className="page-top">
      <StatusIndicator>
        <Lottie options={{
            animationData: animationData.default,
            rendererSettings: {
              preserveAspectRatio: 'xMidYMid slice'
            }
          }} />
      </StatusIndicator>
    </div>
    <div className="page-body">
      <div className="step">
        Step 5/5
      </div>
      <div className="title">
        Complete
      </div>
      <hr />
      <div className="description">
        <div className="description-content">
          You are now the proud beneficiary of {lotInTbtc.toNumber()} TBTC
        </div>
        <div className="bond-duration">
          Bond duration: 6 months
        </div>
        {/* TODO: Update to use CopyInputField */}
        {
          depositAddress && depositAddress.length > 0
          ? <div>
              <br />
              <h3>TDT ID:</h3>
              { depositAddress }
            </div>
          : ''
        }
      </div>
    </div>
  </div>
}

const mapStateToProps = (state, ownProps) => {
  return {
    depositAddress: state.deposit.depositAddress,
    lotInSatoshis: state.deposit.lotInSatoshis,
    signerFeeInSatoshis: state.deposit.signerFeeInSatoshis,
  }
}

export default connect(
  mapStateToProps
)(Congratulations)
