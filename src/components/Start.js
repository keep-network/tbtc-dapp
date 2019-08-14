import React, { Component } from 'react'

import history from '../history'
import { Web3Status } from './lib'
import { requestPermission } from '../lib/NotificationWrapper'

class Start extends Component {

  componentDidMount() {
    requestPermission()
  }

  handleClickPay = (evt) => {
    evt.preventDefault()
    evt.stopPropagation()

    history.push('/invoice')
  }

  render() {
    return (
      <div className="start">
        <div className="page-top">
          <Web3Status />
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

export default Start
