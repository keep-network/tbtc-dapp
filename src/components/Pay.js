import React from 'react';

const Pay = ({ confirming, history }) => {
  let button;

  if (confirming) {
    button = <button onClick={() => {history.push('/prove')}}>Confirming...</button>
  } else {
      button = <button onClick={() => {history.push('/pay/confirming')}}>Send BTC "here"</button>
  }

  return (
    <div className="pay">
      {button}
    </div>
  )
}

export default Pay
