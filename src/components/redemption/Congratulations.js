import React from 'react'
import { connect } from 'react-redux'

import StatusIndicator from '../svgs/StatusIndicator'
import BTCLogo from '../svgs/btclogo'
import { getEtherscanUrl } from '../../utils'

const Congratulations = ({ chainId, depositAddress }) => {
  return (
    <div className="congratulations">
      <div className="page-top">
        <StatusIndicator>
          <BTCLogo height={100} width={100} />
        </StatusIndicator>
      </div>
      <div className="page-body">
        <div className="step">
          Step 6/6
        </div>
        <div className="title">
          Redemption Complete
        </div>
        <hr />
        <div className="description">
          <p>Enjoy your Bitcoin</p>
        </div>
        <div className='cta'>
          <button className="black">
            <a href={getEtherscanUrl(chainId, depositAddress)}
              target="_blank" rel="noopener noreferrer">
              View your transaction
            </a>
          </button>
        </div>
      </div>
    </div>
  )
}

const mapStateToProps = (state) => ({
  depositAddress: state.deposit.depositAddress,
  chainId: state.tbtc.chainId,
})

export default connect(
  mapStateToProps
)(Congratulations)
