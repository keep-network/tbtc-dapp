import React, { useState } from "react"
import Check from "../svgs/Check"
import { useWeb3React } from "@web3-react/core"
import { ConnectWalletDialog } from "./ConnectWalletDialog"

export const Web3Status = (props) => {
  const { active } = useWeb3React()

  const [showConnectWallet, setShowConnectWallet] = useState(false)

  let body = (
    <div>
      <div className="web3-status loading">Loading...</div>
    </div>
  )

  if (!active) {
    body = (
      <div className="web3-status notify">
        <span onClick={() => setShowConnectWallet(true)}>
          Connect to a Wallet
        </span>
      </div>
    )
  } else if (active) {
    body = (
      <div
        className="web3-status success"
        onClick={() => setShowConnectWallet(true)}
      >
        <Check width="15px" /> Connected
      </div>
    )
  }

  return (
    <div>
      <ConnectWalletDialog
        onConnected={() => setShowConnectWallet(false)}
        onClose={() => setShowConnectWallet(false)}
        shown={showConnectWallet}
      />
      {body}
    </div>
  )
}

export default Web3Status
