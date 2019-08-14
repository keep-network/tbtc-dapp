import React, { Component } from 'react';

import history from '../history'

class Home extends Component {

  handleClickPay = (evt) => {
    evt.preventDefault()
    evt.stopPropagation()

    history.push('/start')
  }

  render() {
    return (
      <div className="home">
        <div className="title">
          Bitcoin,
		      <br />
          On
		      <br />
          Ethereum
		      <div className="subtitle">
            <div className="vertical-aligned">
              No KYC, no middlemen, no bullshit.
		        </div>
          </div>
        </div>
        <div className="step-by-step">
          <ol>
            <li>
              <a href="/start" onClick={this.handleClickPay}>
                Deposit BTC
              </a>
            </li>
            <li>
              Mint tBTC
		        </li>
            <li>
              Lend and earn interest on your BTC.
		        </li>
          </ol>
        </div>
        <div className="mission-statement">
          <div className="hook">
            No middlemen. Period.
		      </div>
          <div className="line-and-sinker">
            Censorship resistant, seizure resistant, inflation resistant
		      </div>
        </div>
      </div>
    )
  }
}

export default Home
