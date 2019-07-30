import React from 'react';

const Start = ({ history }) => (
  <div className="start">
    <button onClick={() => {history.push('/pay')}}>Pay</button>
  </div>
)

export default Start
