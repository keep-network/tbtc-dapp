import React from 'react'

import TBTCLogo from '../svgs/TBTCLogo'

const Header = ({ includeSubscription }) => (
  <footer className={includeSubscription ? 'include-subscription' : ''}>
    <div className="footer-content">
      <div className="white-paper">
        <div className="white-paper-label">
          How does it work?
        </div>
        <hr />
        <div className="white-paper-link">
          <a href="keep.network" target="_blank">
            Read the White Paper >>>>
          </a>
        </div>
      </div>
      {
        includeSubscription && (
          <div className="mailing-list">
            TODO
          </div>
        )
      }
      <div className="footer-logo">
        <TBTCLogo width="150" />
      </div>
      <div className="footer-links">
        <a href="keep.network" target="_blank">
          about
        </a>
      </div>
    </div>
  </footer>
)

export default Header