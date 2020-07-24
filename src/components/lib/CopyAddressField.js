import React, { useState, useRef } from 'react'
import QRCode from 'qrcode.react'

import QRCodeIcon from '../svgs/QRCodeIcon'

const CopyAddressField = ({ address, qrCodeUrl }) => {
  const [isCopied, setIsCopied] = useState(false)
  const hiddenCopyFieldRef = useRef(null)

  const handleCopyClick = () => {
    hiddenCopyFieldRef.current.select()
    document.execCommand('copy')
    hiddenCopyFieldRef.current.blur()
    setIsCopied(true)
  }

  return (
    <div className="copy-address-field" onClick={handleCopyClick}>
      { qrCodeUrl ? (
        <div className="qr-code-wrapper">
          <QRCodeIcon />
          <div className="qr-code">
            <QRCode
              value={qrCodeUrl}
              renderAs="svg"
              size={225} />
          </div>
        </div>
      ) : ''}
      <div className="address">
        {address}
      </div>
      <div className="copy-text">
        { isCopied ? 'copied!' : 'copy' }
      </div>
      <textarea
        className="hidden-copy-field"
        ref={hiddenCopyFieldRef}
        defaultValue={address || ''} />
    </div>
  )
}

export default CopyAddressField
