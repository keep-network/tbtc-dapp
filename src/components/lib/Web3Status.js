import React, { useState, useRef, useEffect } from "react"
import { bindActionCreators } from "redux"
import { connect } from "react-redux"
import PropTypes from "prop-types"
import { useWeb3React } from "@web3-react/core"

import NetworkStatusIcon from "../svgs/NetworkStatus"
import Wallet from "../svgs/Wallet"
import { ConnectWalletDialog } from "./ConnectWalletDialog"
import { openWalletModal, closeWalletModal } from "../../actions"

function getNetwork(chainId) {
  switch (chainId) {
    case 1:
      return "Mainnet"
    case 3:
      return "Ropsten"
    case 1101:
      return "Regtest"
    default:
      return "Network Disconnected"
  }
}

const NetworkStatus = ({ chainId }) => {
  const network = getNetwork(chainId)

  return (
    <div
      className={`network-status ${network.toLowerCase().replace(" ", "-")}`}
    >
      <NetworkStatusIcon />
      {network}
    </div>
  )
}

NetworkStatus.propTypes = {
  chainId: PropTypes.number,
}

const AccountButton = ({ account }) => {
  const [isCopied, setIsCopied] = useState(false)
  const hiddenCopyFieldRef = useRef(null)

  const handleCopyClick = () => {
    hiddenCopyFieldRef.current.select()
    document.execCommand("copy")
    hiddenCopyFieldRef.current.blur()
    setIsCopied(true)
  }

  const accountBtnRef = useRef(null)
  useEffect(() => {
    const clickOutside = (e) => {
      if (accountBtnRef.current && !accountBtnRef.current.contains(e.target)) {
        setIsCopied(false)
        document.removeEventListener("click", clickOutside)
      }
    }

    // Only add the listener once the user clicks to copy
    if (isCopied) {
      document.addEventListener("click", clickOutside)
    }
  }, [accountBtnRef, isCopied])

  return (
    <>
      <button
        className={`account-btn ${isCopied ? "copied" : ""}`}
        onClick={handleCopyClick}
        ref={accountBtnRef}
      >
        <Wallet />
        {account ? `${account.slice(0, 5)}···${account.slice(-4)}` : `Connect`}
      </button>
      <textarea
        className="hidden-copy-field"
        ref={hiddenCopyFieldRef}
        defaultValue={account || ""}
      />
    </>
  )
}

AccountButton.propTypes = {
  account: PropTypes.string,
}

export const Web3Status = ({
  isWalletModalOpen,
  openWalletModal,
  closeWalletModal,
}) => {
  const { account, active, chainId } = useWeb3React()

  return (
    <div>
      <ConnectWalletDialog
        onConnected={closeWalletModal}
        onClose={closeWalletModal}
        shown={isWalletModalOpen}
      />
      <div className={`web3-status${active ? " success" : " notify"}`}>
        <NetworkStatus chainId={chainId} />
        {active ? (
          <AccountButton account={account} />
        ) : (
          <button onClick={openWalletModal}>
            <Wallet />
            Connect
          </button>
        )}
      </div>
    </div>
  )
}

Web3Status.propTypes = {
  isWalletModalOpen: PropTypes.bool,
  openWalletModal: PropTypes.func,
  closeWalletModal: PropTypes.func,
}

const mapStateToProps = (state) => ({
  isWalletModalOpen: state.walletModal.isOpen,
})

const mapDispatchToProps = (dispatch) => {
  return bindActionCreators({ openWalletModal, closeWalletModal }, dispatch)
}

export default connect(mapStateToProps, mapDispatchToProps)(Web3Status)
