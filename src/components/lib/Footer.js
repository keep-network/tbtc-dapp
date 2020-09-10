import React from "react"

import { version } from "../../../package.json"

const Footer = () => (
  <footer>
    <div className="version-info">{`v${version}`}</div>
  </footer>
)

export default Footer
