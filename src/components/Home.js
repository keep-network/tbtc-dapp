import React, { Component } from 'react';

import history from '../history'

class Home extends Component {

  handleClickDeposit = (evt) => {
    evt.preventDefault()
    evt.stopPropagation()

    history.push('/deposit/start')
  }

  handleClickRedeem = (evt) => {
    evt.preventDefault()
    evt.stopPropagation()

    history.push('/redemption/initialize')
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
        <div className="mint-or-redeem">
          <a href="/deposit/start" onClick={this.handleClickDeposit}>
            <div className="button blue">
              Deposit
            </div>
          </a>
          <a href="/redemption/initialize" onClick={this.handleClickRedeem}>
            <div className="button black">
              Redeem
            </div>
          </a>
        </div>
        <div className="step-by-step">
          <ol>
            <li>
              Deposit BTC
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
