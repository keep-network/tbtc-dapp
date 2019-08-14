import React from 'react';

const Home = ({ history }) => (
  <div className="home">
    <div className="title">
      Bitcoin,
      <br />
      On
      <br />
      Ethereum
      <div className="subtitle">
        <div className="vertical-aligned">
          No KYC, no middlemen, no bullshit.
        </div>
      </div>
    </div>
    <div className="step-by-step-container">
      <ol className="step-by-step">
        <li>
          <div className="instruction">
            Deposit BTC
          </div>
        </li>
        <li>
          <div className="instruction">
            Mint tBTC
          </div>
        </li>
        <li>
          <div className="instruction">
            Lend and earn interest on your BTC.
          </div>
        </li>
      </ol>
    </div>
    <div className="mission-statement">
      <div className="hook">
        No middlemen. Period.
      </div>
      <div className="line-and-sinker">
        Censorship resistant, seizure resistant, inflation resistant
      </div>
    </div>
  </div>
)

export default Home
