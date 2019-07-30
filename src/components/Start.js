import React from 'react';

const Start = ({ history }) => (
  <button onClick={() => {history.push('/pay')}}>Pay</button>
)

export default Start
