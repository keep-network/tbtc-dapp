import React from 'react'

import TBTCLogo from '../svgs/TBTCLogo'

const Header = ({ includeSubscription }) => (
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
          TODO
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

export default Header