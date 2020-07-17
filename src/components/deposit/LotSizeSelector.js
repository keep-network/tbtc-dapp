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

const LotSizeSelector = ({ lotSizes = [], onSelect = () => {} }) => {
  const [selectedLotSize, setSelectedLotSize] = useState(null)
  const handleClick = (size) => {
    setSelectedLotSize(size)
    onSelect(size)
  }

  return (
    <ul className="lot-size-selector">
      { lotSizes.map((lotSize, i) => (
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
