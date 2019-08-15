import React, { Component } from 'react';

import history from '../history'

class Home extends Component {

  handleClickPay = (evt) => {
    evt.preventDefault()
    evt.stopPropagation()

    history.push('/start')
  }

  render() {
    const { noEntry } = this.props
    const isMobile = window.innerWidth < 768

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
              { isMobile
                ? <span>
                    No KYC,
                    <br />
                    no middlemen,
                    <br />
                    no bullshit.
                  </span>
                : <span>No KYC, no middlemen, no bullshit.</span>
              }
		        </div>
          </div>
        </div>
        <div className="step-by-step">
          <ol>
            <li>
              { noEntry
                ? 'Deposit BTC'
                : <a href="/start" onClick={this.handleClickPay}>
                    Deposit BTC
                  </a>
              }
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
            Censorship resistant, seizure resistant, inflation resistant.
		      </div>
        </div>
      </div>
    )
  }
}

export default Home
