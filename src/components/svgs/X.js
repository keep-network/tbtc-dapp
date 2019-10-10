import React from 'react'

const X = ({width, height}) => (
  <svg width={width} height={height} viewBox="0 0 50 50" fill="none" className="x-icon" xmlns="http://www.w3.org/2000/svg">
    <circle cx="25" cy="25" r="23.5" fill="#F7CDC3" stroke="#E7755C" strokeWidth="3"/>
    <line x1="15.0607" y1="15.9393" x2="35.0607" y2="35.9393" stroke="#E7755C" strokeWidth="3"/>
    <line x1="14.9393" y1="35.9393" x2="34.9393" y2="15.9393" stroke="#E7755C" strokeWidth="3"/>
  </svg>
)

export default X