import React, { Component } from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'

import StatusIndicator from '../svgs/StatusIndicator'
import { buildTransactionAndSubmitSignature } from '../../actions'

class Signing extends Component {
  componentDidMount() {
    const { buildTransactionAndSubmitSignature } = this.props

    buildTransactionAndSubmitSignature()
  }

  render() {
    return (
      <div className="confirming">
        <div className="page-top">
          <StatusIndicator pulse />
        </div>
        <div className="page-body">
          <div className="step">
            Step 3/6
          </div>
          <div className="title">
            Waiting on signing group
          </div>
          <hr />
          <div className="description">
            <p>We’re waiting for the deposit signing group to sign and build your Bitcoin transaction.</p>
          </div>
        </div>
      </div>
    )
  }
}

const mapDispatchToProps = (dispatch) => {
  return bindActionCreators(
    {
      buildTransactionAndSubmitSignature
    },
    dispatch
  )
}

export default connect(
  null,
  mapDispatchToProps
)(Signing)

