import React, { useState } from 'react'
import classNames from 'classnames'

import Check from '../svgs/Check'

const LotSizeOption = ({ lotSize, onClick, selected }) => {
  const handleClick = () => {
    onClick(lotSize)
  }
  return (
    <li className={classNames('lot-size-option', { selected })}
      onClick={handleClick}>
      <button>
        <span className="lot-size-option-label">
          {lotSize}&nbsp;&nbsp;฿
        </span>
        { selected ? <Check /> : '' }
      </button>
    </li>
  )
}

const LotSizeSelector = ({ onSelect = () => {} }) => {
  // in BTC
  const lotSizeOptions = [0.01, 0.1, 0.2, 0.5, 1]

  const [selectedLotSize, setSelectedLotSize] = useState(null)
  const handleClick = (size) => {
    setSelectedLotSize(size)
    onSelect(size)
  }

  return (
    <ul className="lot-size-selector">
      { lotSizeOptions.map((lotSize, i) => (
        <LotSizeOption
          key={`lot-size-option-${i}`}
          lotSize={lotSize}
          onClick={handleClick}
          selected={lotSize === selectedLotSize} />
      ))}
    </ul>
  )
}

export default LotSizeSelector
