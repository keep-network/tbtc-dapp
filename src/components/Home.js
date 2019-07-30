import React from 'react';

const Home = ({ history }) => (
  <button onClick={() => {history.push('/start')}}>Make a Deposit</button>
)

export default Home
