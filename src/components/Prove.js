import React, { Component } from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'

import { submitProof } from '../actions'

class Prove extends Component {

  handleClickProve = (evt) => {
    const { submitProof, history } = this.props

    submitProof({ history })
  }

  render() {
    return (
      <div className="prove">
        <button onClick={this.handleClickProve}>Submit Proof</button>
      </div>
    )
  }
}


const mapDispatchToProps = (dispatch) => {
  return bindActionCreators(
      {
        submitProof
      },
      dispatch
  )
}

export default connect(
  () => ({}),
  mapDispatchToProps
)(Prove)
