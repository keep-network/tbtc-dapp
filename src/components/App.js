import React, { Component } from 'react';
import { withBalance } from '../wrappers/web3'

class App extends Component {
  render() {
    const { children, balance } = this.props

    return (
      <div className="app">
        <div className="nav">
          <div>Balance (in Wei): {balance}</div>
        </div>
        { children }
      </div>
    )
  }
}

export default withBalance(App)
