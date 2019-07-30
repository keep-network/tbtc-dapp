import React from 'react';

const Prove = ({ history }) => (
  <div className="prove">
    <button onClick={() => {history.push('/congratulations')}}>Submit Proof</button>
  </div>
)

export default Prove
