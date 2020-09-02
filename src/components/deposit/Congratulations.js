import React from "react"
import { connect } from "react-redux"
import Lottie from "react-lottie"
import PropTypes from "prop-types"

import StatusIndicator from "../svgs/StatusIndicator"
import * as tbtcLogoAnimationData from "../animation/tBTC-logo-animate.json"
import CopyAddressField from "../lib/CopyAddressField"
import { formatSatsToBtc, getEtherscanUrl } from "../../utils"

const Congratulations = ({ depositAddress, lotInTbtc, chainId }) => {
  return (
    <div className="congratulations">
      <div className="page-top">
        <StatusIndicator donut fadeIn>
          <Lottie
            options={{
              loop: false,
              autoplay: true,
              animationData: tbtcLogoAnimationData.default,
              rendererSettings: {
                preserveAspectRatio: "xMidYMid slice",
              },
            }}
            width="125%"
            height="125%"
          />
        </StatusIndicator>
      </div>
      <div className="page-body">
        <div className="step">Step 5/5</div>
        <div className="title">Complete</div>
        <hr />
        <div className="description">
          <div className="tdt-id-label">TDT ID:</div>
          <CopyAddressField address={depositAddress} />
          <div className="description-content">
            <p>You are now the proud beneficiary of {lotInTbtc} TBTC.</p>
            <p>Please store your TDT ID for future redemption.</p>
          </div>
          <div className="bond-duration">Bond duration: 6 months</div>
          <a
            href={getEtherscanUrl(chainId, depositAddress)}
            target="_blank"
            rel="noopener noreferrer"
          >
            view on Etherscan
          </a>
        </div>
      </div>
    </div>
  )
}

Congratulations.propTypes = {
  depositAddress: PropTypes.string,
  lotInTbtc: PropTypes.string,
  chainId: PropTypes.number,
}

const mapStateToProps = (state) => {
  const { depositAddress, lotInSatoshis, signerFeeInSatoshis } = state.deposit
  const mintedSatoshis = lotInSatoshis.sub(signerFeeInSatoshis)

  return {
    depositAddress,
    lotInTbtc: formatSatsToBtc(mintedSatoshis),
    chainId: state.tbtc.web3.chainId,
  }
}

export default connect(mapStateToProps)(Congratulations)
