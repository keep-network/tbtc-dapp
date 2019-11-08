import React, { Component } from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'

import StatusIndicator from '../svgs/StatusIndicator'
import { broadcastTransaction } from '../../actions'

class Signing extends Component {
  componentDidMount() {
    const { broadcastTransaction } = this.props

    broadcastTransaction()
  }

  render() {
    return (
      <div className="confirming">
        <div className="page-top">
          <StatusIndicator pulse />
        </div>
        <div className="page-body">
          <div className="step">
            Step 3/4
          </div>
          <div className="title">
            Waiting on signing group
          </div>
          <hr />
          <div className="description">
            <p>We’re waiting for the deposit signing group to sign and broadcast your Bitcoin transaction.</p>
          </div>
        </div>
      </div>
    )
  }
}

const mapDispatchToProps = (dispatch) => {
  return bindActionCreators(
    {
      broadcastTransaction
    },
    dispatch
  )
}

export default connect(
  null,
  mapDispatchToProps
)(Signing)

