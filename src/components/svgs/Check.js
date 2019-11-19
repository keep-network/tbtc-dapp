import React from 'react'

const check = ({width, height}) => (
  <svg width={width} height={height} viewBox="0 0 50 50" fill="none" className="check-icon" >
    <circle cx="25" cy="25" r="23.5" fill="#CCFCC7" stroke="#5CE783" strokeWidth="3"/>
    <path d="M11.5 25L21 34.5L38.5 17" stroke="#5CE783" strokeWidth="3"/>
  </svg>
)

export default check
