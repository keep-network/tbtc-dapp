import React from 'react'

import TBTCLogo from '../svgs/TBTCLogo'

const Header = props => (
  <header className="nav">
    <div className="logo">
      <TBTCLogo width="150" />
    </div>
    {/* <div className="hamburger">&#x2e2c;</div> */}
  </header>
)

export default Header
