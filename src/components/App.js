import React, { Component } from 'react';
import { Link } from 'react-router-dom'

import TBTCLogo from './svgs/TBTCLogo'

class App extends Component {
  render() {
    const { children } = this.props

    return (
      <div className="app">
        <div className="nav">
          <div className="logo">
            <TBTCLogo width="150" />
          </div>
          <div className="hamburger">&#x2e2c;</div>
        </div>
        { children }
      </div>
    )
  }
}

export default App
