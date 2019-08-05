import React from 'react';

const Home = ({ history }) => (
  <div className="home">
    <button onClick={() => {history.push('/start')}}>Make a Deposit</button>
  </div>
)

export default Home
