import React from "react"
import { bindActionCreators } from "redux"
import { connect } from "react-redux"
import PropTypes from "prop-types"
import { useWeb3React } from "@web3-react/core"

import NetworkStatus from "../svgs/NetworkStatus"
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

function getAccountLabel(account) {
  if (!account) {
    return ""
  }

  return `${account.slice(0, 5)}···${account.slice(-4)}`
}

export const Web3Status = ({
  isWalletModalOpen,
  openWalletModal,
  closeWalletModal,
}) => {
  const { account, active, chainId } = useWeb3React()
  const network = getNetwork(chainId)

  return (
    <div>
      <ConnectWalletDialog
        onConnected={closeWalletModal}
        onClose={closeWalletModal}
        shown={isWalletModalOpen}
      />
      <div
        className={`web3-status${active ? " success" : " notify"}`}
        onClick={openWalletModal}
      >
        <div
          className={`network-status ${network
            .toLowerCase()
            .replace(" ", "-")}`}
        >
          <NetworkStatus />
          {network}
        </div>
        <button>
          <Wallet />
          {active ? getAccountLabel(account) : "Connect"}
        </button>
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
