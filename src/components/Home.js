import React from "react"
import { Link } from "react-router-dom"

import MintLogo from "../components/svgs/TLogoCircle"
import RedeemLogo from "../components/svgs/RedeemBtcLogo"

const Home = () => {
  return (
    <div className="home">
      <h1>A match made in DeFi.</h1>
      <div className="mint-or-redeem">
        <div>
          <MintLogo />
          <Link to="/deposit">Mint tBTC →</Link>
        </div>
        <div>
          <RedeemLogo />
          <Link to="/redeem">Redeem BTC →</Link>
        </div>
      </div>
    </div>
  )
}

export default Home
