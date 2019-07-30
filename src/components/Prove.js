import React from 'react';

const Prove = ({ history }) => (
  <button onClick={() => {history.push('/congratulations')}}>Submit Proof</button>
)

export default Prove
