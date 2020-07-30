import React, { Component } from 'react'

import Check from '../svgs/Check'
import { version } from '../../../package.json'

const validEmailRegex = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/

class Footer extends Component {
  state = {
    email: '',
    success: false,
    error: '',
    loading: false,
    errorLogUrl: ''
  }

  handleInput = (evt) => {
    this.setState({ email: evt.target.value })
  }

  handleSubmit = async (evt) => {
    evt.preventDefault()
    evt.stopPropagation()

    const { email } = this.state

    if (!email.match(validEmailRegex)) {
      this.setState({
        error: 'Invalid email',
        loading: false
      })
      return
    }

    try {
      this.setState({ loading: true })

      await fetch('https://backend.tbtc.network/mailing-list/signup', {
        method: 'POST',
        body: JSON.stringify({ email })
      }).then(res => res.json())

      this.setState({
        success: true,
        error: '',
        loading: false
      })
    } catch (err) {
      this.setState({
        error: err.toString(),
        loading: false
      })
    }
  }

  handleDownloadError = (e) => {
    const blob = new Blob(
      [JSON.stringify(console.history, null, 2)], { type: 'application/json' }
    )
    this.setState({
      errorLogUrl: window.URL.createObjectURL(blob)
    })
  }

  render() {
    const { includeSubscription } = this.props
    const { email, error, success, loading } = this.state

    return (
      <footer className={includeSubscription ? 'include-subscription' : ''}>
        <div className="footer-content">
          <div className="white-paper">
            <div className="white-paper-label">
              Learn more about tBTC
            </div>
            <div className="white-paper-link">
              <a href="http://docs.keep.network/tbtc/index.pdf" target="_blank" rel="noopener noreferrer">
                Read the Spec {`>>>>`}
              </a>
            </div>
          </div>
          <a
            className="download-error-button" onClick={this.handleDownloadError}
            href={this.state.errorLogUrl}
            download={`tbtc-dapp-v${version}-log-${new Date().getTime()}.txt`}>
              Download Error Log ↓
          </a>
        </div>
        {
          includeSubscription && (
            <div className="mailing-list">
              <form onSubmit={this.handleSubmit}>
                <input
                  type="text"
                  disabled={loading || success}
                  onChange={this.handleInput}
                  value={email}
                  placeholder="enter your email to receive updates" />
                { success
                  ? <div className="success">
                      <Check width="30px" height="30px" />
                    </div>
                  : <input type="submit" value={loading ? "(submitting...)" : "Submit >>>>"} />
                }
              </form>
              { error
                ? <div className="error">
                    { error }
                  </div>
                : ''
              }
            </div>
          )
        }
        <div className="version-info">{`v${version}`}</div>
      </footer>
    )
  }
}

export default Footer
