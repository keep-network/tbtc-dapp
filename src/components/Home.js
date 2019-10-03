import React, { Component } from 'react';

import history from '../history'

class Home extends Component {

  state = {
    hoverDeposit: false,
    hoverRedeem: false
  }

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

  handleHoverDeposit = () => {
    this.setState({ hoverDeposit: true })
  }

  handleHoverLeaveDeposit = () => {
    this.setState({ hoverDeposit: false })
  }

  handleHoverRedeem = () => {
    this.setState({ hoverRedeem: true })
  }

  handleHoverLeaveRedeem = () => {
    this.setState({ hoverRedeem: false })
  }

  render() {
    const { noEntry } = this.props
    const isMobile = window.innerWidth < 768
    const { hoverDeposit, hoverRedeem } = this.state

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
        <div className="mint-or-redeem">
          <a href="/deposit/start" onClick={this.handleClickDeposit}>
            <div className="button blue" onMouseOver={this.handleHoverDeposit} onMouseLeave={this.handleHoverLeaveDeposit}>
              Deposit {hoverDeposit ? '>>>' : ''}
            </div>
          </a>
          <a href="/redemption/initialize" onClick={this.handleClickRedeem}>
            <div className="button black" onMouseOver={this.handleHoverRedeem} onMouseLeave={this.handleHoverLeaveRedeem}>
              Redeem {hoverRedeem ? '>>>' : ''}
            </div>
          </a>
        </div>
        <div className="step-by-step">
          <ol>
            <li>
              Deposit BTC
            </li>
            <li>
              Mint TBTC
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
