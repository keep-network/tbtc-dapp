import React from 'react'
import { connect } from 'react-redux'
import Lottie from 'react-lottie'

import StatusIndicator from '../svgs/StatusIndicator'
import * as animationData from '../animation/tBTC-logo-animate.json'
import CopyAddressField from '../lib/CopyAddressField'
import { BitcoinHelpers } from '@keep-network/tbtc.js'

import BigNumber from "bignumber.js"
BigNumber.set({ DECIMAL_PLACES: 8 })

const Congratulations = ({ depositAddress, lotInSatoshis, signerFeeInSatoshis, chainId }) => {
  const mintedSatoshis = lotInSatoshis.sub(signerFeeInSatoshis)
  const lotInTbtc = (new BigNumber(mintedSatoshis.toString())).div(BitcoinHelpers.satoshisPerBtc.toString())

  return <div className="congratulations">
    <div className="page-top">
      <StatusIndicator donut fadeIn>
        <Lottie options={{
            loop: false,
            autoplay: true,
            animationData: animationData.default,
            rendererSettings: {
              preserveAspectRatio: 'xMidYMid slice'
            }
          }} width="125%" height="125%" />
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
        {
          depositAddress && depositAddress.length > 0
          ? <>
              <div className="deposit-address-label">Deposit Address:</div>
              <CopyAddressField address={depositAddress} />
            </>
          : ''
        }
        <div className="description-content">
          You are now the proud beneficiary of {lotInTbtc.toNumber()} TBTC
        </div>
        <div className="bond-duration">
          Bond duration: 6 months
        </div>
        <button className="black">
          <a href={
            `https://${chainId === 3 ? 'ropsten.' : ''}etherscan.io/token/${depositAddress}`
          } target="_blank" rel="noopener noreferrer">view on Etherscan</a>
        </button>
      </div>
    </div>
  </div>
}

const mapStateToProps = (state, ownProps) => {
  return {
    depositAddress: state.deposit.depositAddress,
    lotInSatoshis: state.deposit.lotInSatoshis,
    signerFeeInSatoshis: state.deposit.signerFeeInSatoshis,
    chainId: state.tbtc.chainId,
  }
}

export default connect(
  mapStateToProps
)(Congratulations)
