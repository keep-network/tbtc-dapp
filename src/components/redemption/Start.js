import React, { useState, useEffect } from "react"
import classnames from "classnames"
import { bindActionCreators } from "redux"
import { connect } from "react-redux"
import PropTypes from "prop-types"
import { useParams } from "react-router-dom"
import { useWeb3React } from "@web3-react/core"

import { BitcoinHelpers } from "@keep-network/tbtc.js"

import StatusIndicator from "../svgs/StatusIndicator"
import TLogo from "../svgs/tlogo"
import Check from "../svgs/Check"
import X from "../svgs/X"
import { saveAddresses, resetState, openWalletModal } from "../../actions"

import web3 from "web3"

const Start = ({ saveAddresses, resetState, openWalletModal }) => {
  const initialAddressState = {
    address: "",
    isValid: false,
    hasError: false,
  }

  const params = useParams()

  const [depositAddress, setDepositAddress] = useState({
    ...initialAddressState,
    address: params.address || "",
  })
  const [btcAddress, setBtcAddress] = useState(initialAddressState)

  useEffect(() => {
    resetState()
  }, [resetState])

  useEffect(() => {
    if (depositAddress.address) {
      const isValid = web3.utils.isAddress(depositAddress.address)
      const hasError = !isValid
      setDepositAddress({ address: depositAddress.address, isValid, hasError })
    }
  }, [depositAddress.address])

  const { active } = useWeb3React()

  const handleClickConfirm = (evt) => {
    evt.preventDefault()
    evt.stopPropagation()

    if (!active) {
      openWalletModal()
      return
    }

    saveAddresses({
      btcAddress: btcAddress.address,
      depositAddress: depositAddress.address,
    })
  }

  const handleDepositAddressChange = (evt) => {
    const address = evt.target.value

    const isValid = web3.utils.isAddress(address)
    const hasError = !isValid

    setDepositAddress({ address, isValid, hasError })
  }

  const verifyBtcAddress = (btcAddress) => {
    try {
      return BitcoinHelpers.Address.toScript(btcAddress)
    } catch (err) {
      console.log("Error parsing BTC address: ", btcAddress, err)
      return false
    }
  }

  const handleBtcAddressChange = (evt) => {
    // TODO: Validate btc address
    const address = evt.target.value

    const isValid = verifyBtcAddress(address)
    const hasError = !isValid

    setBtcAddress({ address, isValid, hasError })
  }

  return (
    <div className="redemption-start">
      <div className="page-top">
        <StatusIndicator donut>
          <TLogo height={100} width={100} />
        </StatusIndicator>
      </div>
      <div className="page-body">
        <div className="step">Step 1/6</div>
        <div className="title">Redeem bond</div>
        <hr />
        <div className="description">
          <div
            className={classnames("paste-field", {
              success: depositAddress.isValid,
              alert: depositAddress.hasError,
            })}
          >
            <label htmlFor="deposit-address">What was your TDT ID?</label>
            <input
              type="text"
              id="deposit-address"
              onChange={handleDepositAddressChange}
              value={depositAddress.address}
              placeholder="Enter TDT ID"
            />
            {depositAddress.isValid && <Check height="28px" width="28px" />}
            {depositAddress.hasError && <X height="28px" width="28px" />}
          </div>
          <div
            className={classnames("paste-field", {
              success: btcAddress.isValid,
              alert: btcAddress.hasError,
            })}
          >
            <label htmlFor="btc-address">
              Where should we send your Bitcoin?
            </label>
            <input
              type="text"
              id="btc-address"
              onChange={handleBtcAddressChange}
              value={btcAddress.address}
              placeholder="Enter BTC Address"
            />
            {btcAddress.isValid && <Check height="28px" width="28px" />}
            {btcAddress.hasError && <X height="28px" width="28px" />}
          </div>
        </div>
        <div className="cta">
          <button
            onClick={handleClickConfirm}
            disabled={!depositAddress.isValid || !btcAddress.isValid}
            className="black"
          >
            Redeem
          </button>
        </div>
      </div>
    </div>
  )
}

Start.propTypes = {
  saveAddresses: PropTypes.func,
  resetState: PropTypes.func,
  openWalletModal: PropTypes.func,
}

const mapDispatchToProps = (dispatch) => {
  return bindActionCreators(
    {
      saveAddresses,
      resetState,
      openWalletModal,
    },
    dispatch
  )
}

export default connect(null, mapDispatchToProps)(Start)
