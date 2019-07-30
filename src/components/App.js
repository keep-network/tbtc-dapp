import React, { Component } from 'react';
import { withBalance } from '../wrappers/web3'
import { Link } from 'react-router-dom'

class App extends Component {
  render() {
    const { children, balance } = this.props

    return (
      <div className="app">
        <div className="nav">
          <div className="title">
            <Link to='/'>tBTC</Link>
          </div>
          <div className="balance">Balance (in Wei): {balance}</div>
        </div>
        { children }
      </div>
    )
  }
}

export default withBalance(App)
