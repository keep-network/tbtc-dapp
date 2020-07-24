import React, { useState } from 'react'
import classNames from 'classnames'

const LotSizeOption = ({ lotSize, onClick, selected }) => {
  const handleClick = () => {
    onClick(lotSize)
  }
  return (
    <li className={classNames('lot-size-option', { selected })}
      onClick={handleClick}>
        <input type="radio" id={lotSize} name="lot-size" value={lotSize} 
          checked={selected} readOnly />
        <label className="lot-size-option-label" htmlFor={lotSize}>
          {lotSize}&nbsp;&nbsp;฿
        </label>
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
