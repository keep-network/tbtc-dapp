import React, { Component } from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { useParams } from 'react-router-dom'

import StatusIndicator from '../svgs/StatusIndicator'
import { requestRedemption } from '../../actions'

function Redeeming(props) {
  const params = useParams()
  return <RedeemingComponent {...props} address={props.address || params.address} />
}

class RedeemingComponent extends Component {
  componentDidMount() {
    const { requestRedemption } = this.props

    requestRedemption()
  }

  render() {
    return (
      <div className="confirming">
        <div className="page-top">
          <StatusIndicator pulse />
        </div>
        <div className="page-body">
          <div className="step">
            Step 2/6
          </div>
          <div className="title">
            Redeeming...
          </div>
          <hr />
          <div className="description">
            <p>We’re waiting for you to confirm invoice details in your Wallet.</p>
          </div>
        </div>
      </div>
    )
  }
}

const mapDispatchToProps = (dispatch) => {
  return bindActionCreators(
    {
        requestRedemption
    },
    dispatch
  )
}

export default connect(
  null,
  mapDispatchToProps
)(Redeeming)

