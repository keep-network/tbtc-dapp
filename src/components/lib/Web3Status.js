import React from "react"
import { bindActionCreators } from "redux"
import { connect } from "react-redux"
import PropTypes from "prop-types"
import Check from "../svgs/Check"
import { useWeb3React } from "@web3-react/core"
import { ConnectWalletDialog } from "./ConnectWalletDialog"
import { openWalletModal, closeWalletModal } from "../../actions"

export const Web3Status = ({
  isWalletModalOpen,
  openWalletModal,
  closeWalletModal,
}) => {
  const { active } = useWeb3React()

  let body = (
    <div>
      <div className="web3-status loading">Loading...</div>
    </div>
  )

  if (!active) {
    body = (
      <div className="web3-status notify">
        <span onClick={openWalletModal}>Connect to a Wallet</span>
      </div>
    )
  } else if (active) {
    body = (
      <div className="web3-status success" onClick={openWalletModal}>
        <Check width="15px" /> Connected
      </div>
    )
  }

  return (
    <div>
      <ConnectWalletDialog
        onConnected={closeWalletModal}
        onClose={closeWalletModal}
        shown={isWalletModalOpen}
      />
      {body}
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
