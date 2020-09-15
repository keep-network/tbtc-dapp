import React from "react"
import { bindActionCreators } from "redux"
import { connect } from "react-redux"
import PropTypes from "prop-types"
import { useWeb3React } from "@web3-react/core"

import Wallet from "../svgs/Wallet"
import { ConnectWalletDialog } from "./ConnectWalletDialog"
import { openWalletModal, closeWalletModal } from "../../actions"

export const Web3Status = ({
  isWalletModalOpen,
  openWalletModal,
  closeWalletModal,
}) => {
  const { active } = useWeb3React()

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
        <button>
          <Wallet />
          {active ? "Connected" : "Connect"}
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
