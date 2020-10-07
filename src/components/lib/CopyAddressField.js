import React from "react"
import QRCode from "qrcode.react"
import PropTypes from "prop-types"

import { useClickToCopy } from "../hooks"
import QRCodeIcon from "../svgs/QRCodeIcon"

const CopyAddressField = ({ address, qrCodeUrl }) => {
  const { isCopied, hiddenCopyFieldRef, handleCopyClick } = useClickToCopy()

  return (
    <div className="copy-address-field" onClick={handleCopyClick}>
      {qrCodeUrl ? (
        <div className="qr-code-wrapper">
          <QRCodeIcon />
          <div className="qr-code">
            <QRCode value={qrCodeUrl} renderAs="svg" size={225} />
          </div>
        </div>
      ) : (
        ""
      )}
      <div className="address">{address}</div>
      <div className="copy-text">{isCopied ? "copied!" : "copy"}</div>
      <textarea
        className="hidden-copy-field"
        ref={hiddenCopyFieldRef}
        defaultValue={address || ""}
      />
    </div>
  )
}

CopyAddressField.propTypes = {
  address: PropTypes.string,
  qrCodeUrl: PropTypes.string,
}

export default CopyAddressField
