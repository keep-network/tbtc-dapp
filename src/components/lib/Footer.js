import React, { Component } from 'react'

import TBTCLogo from '../svgs/TBTCLogo'

const validEmailRegex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/

class Header extends Component {
  state = {
    email: ''
  }

  handleInput = (evt) => {
    this.setState({ email: evt.target.value })
  }

  handleSubmit = (evt) => {
    evt.preventDefault()
    evt.stopPropagation()

    const { email } = this.state

    if (email.match(validEmailRegex)) {
      console.log("SUCCESS: ", email)
    } else {
      console.log("Failure: ", email)
    }
  }

  render() {
    const { includeSubscription } = this.props
    const { email } = this.state

    return (
      <footer className={includeSubscription ? 'include-subscription' : ''}>
        <div className="footer-content">
          <div className="white-paper">
            <div className="white-paper-label">
              Learn how
            </div>
            <hr />
            <div className="white-paper-link">
              <a href="http://docs.keep.network/tbtc/index.pdf" target="_blank" rel="noopener noreferrer">
                Read the Spec >>>>
              </a>
            </div>
          </div>
        </div>
        {
          includeSubscription && (
            <div className="mailing-list">
              <form onSubmit={this.handleSubmit}>
                <input
                  type="text"
                  onChange={this.handleInput}
                  value={email}
                  placeholder="enter your email to recieve updates" />
                <input type="submit" value="Submit >>>>" />
              </form>
            </div>
          )
        }
        <div className="footer-content">
          <div className="footer-bottom">
            <div className="footer-logo">
              <TBTCLogo width="150" />
            </div>
            <div className="footer-links">
              <a href="http://keep.network/" target="_blank" rel="noopener noreferrer">
                about
              </a>
            </div>
          </div>
        </div>
      </footer>
    )
  }
}

export default Header