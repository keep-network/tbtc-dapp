import React from 'react';

const Pay = ({ confirming, history }) => {
  if (confirming) {
    return (
      <button onClick={() => {history.push('/prove')}}>Confirming...</button>
    )
  } else {
    return (
      <button onClick={() => {history.push('/pay/confirming')}}>Send BTC "here"</button>
    )
  }
}

export default Pay
