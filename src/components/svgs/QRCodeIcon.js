import React from "react"

const QRCodeIcon = ({ size = 25, color = "#111010" }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={size}
    height={size}
    fill="none"
    viewBox="0 0 50 50"
    className="qr-code-icon"
  >
    <path fill={color} d="M0 0H10V10H0z"></path>
    <path fill={color} d="M40 0H50V10H40z"></path>
    <path fill={color} d="M30 10H40V20H30z"></path>
    <path fill={color} d="M30 0H40V10H30z"></path>
    <path fill={color} d="M20 0H30V10H20z"></path>
    <path fill={color} d="M0 20H10V30H0z"></path>
    <path fill={color} d="M10 20H20V30H10z"></path>
    <path fill={color} d="M20 10H30V20H20z"></path>
    <path fill={color} d="M40 20H50V30H40z"></path>
    <path fill={color} d="M30 30H40V40H30z"></path>
    <path fill={color} d="M20 40H30V50H20z"></path>
    <path fill={color} d="M40 40H50V50H40z"></path>
    <path fill={color} d="M10 30H20V40H10z"></path>
    <path fill={color} d="M0 40H10V50H0z"></path>
  </svg>
)

export default QRCodeIcon
