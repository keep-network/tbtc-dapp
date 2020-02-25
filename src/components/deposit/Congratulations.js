import React from 'react'
import { connect } from 'react-redux'

import StatusIndicator from '../svgs/StatusIndicator'
import TLogo from '../svgs/tlogo'

const Congratulations = ({ depositAddress }) => {
  return <div className="congratulations">
    <div className="page-top">
      <StatusIndicator purple>
        <TLogo height={100} width={100} />
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
          You are now the proud beneficiary of 1 TBTC
        </div>
        <div className="bond-duration">
          Bond duration: 6 months
        </div>
        {/* TODO: Update to use CopyInputField */}
        {
          depositAddress && depositAddress.length > 0
          ? <div>
              <br />
              <h3>Deposit Address:</h3>
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
    depositAddress: state.deposit.depositAddress
  }
}

export default connect(
  mapStateToProps
)(Congratulations)
