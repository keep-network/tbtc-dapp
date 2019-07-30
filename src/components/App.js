import React, { Component } from 'react';

class App extends Component {
  render() {
    const { children } = this.props

    return (
      <div className="app">
        <div className="nav">
          <div>tBTC</div>
        </div>
        { children }
      </div>
    )
  }
}

export default App
