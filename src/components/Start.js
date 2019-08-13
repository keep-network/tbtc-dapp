import React, { Component } from 'react'
import { connect } from 'react-redux'

import history from '../history'

class Start extends Component {

  handleClickPay = (evt) => {
    evt.preventDefault()
    evt.stopPropagation()

    history.push('/invoice')
  }

  render() {
    return (
      <div className="start">
        <div className="page-top">
          {/* TODO: Add Web3 indicator*/}
        </div>
        <div className="page-body">
          <div className="step">
            Step 1/5
          </div>
          <div className="title">
            Begin a bond
          </div>
          <hr />
          <div className="description">
            Maecenas sed diam eget risus varius blandit sit amet non magna.  Maecenas sed diam eget risus varius blandit sit amet non magna.
          </div>
          <div className="cta">
            <a href="/invoice" onClick={this.handleClickPay}>
              Begin now >>>
            </a>
          </div>
        </div>
      </div>
    )
  }
}


export default connect(
)(Start)
