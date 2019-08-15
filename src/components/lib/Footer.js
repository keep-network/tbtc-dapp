import React, { Component } from 'react'

import TBTCLogo from '../svgs/TBTCLogo'
import Check from '../svgs/Check'

const validEmailRegex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/

class Footer extends Component {
  state = {
    email: '',
    success: false,
    error: ''
  }

  handleInput = (evt) => {
    this.setState({ email: evt.target.value })
  }

  handleSubmit = (evt) => {
    evt.preventDefault()
    evt.stopPropagation()

    const { email } = this.state

    if (email.match(validEmailRegex)) {
      fetch('https://backend.tbtc.network/mailing-list/signup', {
        method: 'POST',
        data: JSON.stringify({ email })
      }).then(res => res.json())
        .then(data => {
          console.log("SUCCESS: ", data)
          this.setState({ success: true, error: '' })
        })
        .catch(err => {
          console.log("ERROR: ", err)
          this.setState({ error: err.toString() })
        })
    } else {
      this.setState({
        error: 'Invalid email'
      })
    }
  }

  render() {
    const { includeSubscription } = this.props
    const { email, error, success } = this.state

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
              { error
                ? <div className="error">
                    { error }
                  </div>
                : ''
              }
              { success
                ? <div className="success">
                    <Check width="80px" height="80px" />
                  </div>
                : ''
              }
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

export default Footer