import React from 'react';
import { render, hydrate } from 'react-dom'
import { createStore, applyMiddleware } from 'redux'
import createSagaMiddleware from 'redux-saga'
import routerMiddleware from './lib/router/middleware'
import notificationMiddleware from './lib/notifications/middleware'
import { Provider, useSelector } from 'react-redux'
import { Router, Route, useParams } from 'react-router-dom'

// Styles
import './css/app.scss'

// Components
import {
  App,
  Home
} from './components'
import {
  Start as StartDeposit,
  Invoice,
  RequestDeposit,
  GetAddress,
  Pay,
  Prove as ProveDeposit,
  Congratulations as CongratulationsDeposit
} from './components/deposit'
import {
  Start as StartRedemption,
  Redeeming,
  Signing,
  Confirming,
  Prove as ProveRedemption,
  Congratulations as CongratulationsRedemption
} from './components/redemption'


// Wrappers
import Web3Wrapper from './wrappers/web3'
import { withAccount } from './wrappers/web3'

// Redux
import sagas from './sagas'
import reducers from './reducers'
import history from './history'
import { bindActionCreators } from 'redux';
import { setEthereumAccount, restoreDepositState, restoreRedemptionState } from './actions';
import { connect } from 'react-redux'
import deposit from './reducers/deposit';

// Set up our store
const sagaMiddleware = createSagaMiddleware()
const middleware = [
  routerMiddleware,
  notificationMiddleware,
  sagaMiddleware,
]

const store = createStore(
  reducers,
  applyMiddleware(...middleware),
)

sagaMiddleware.run(sagas)

// Compose our application tree
function AppWrapper() {
  return (
    <Provider store={store}>
      <Router history={history}>
        <Web3Wrapper>
          <App>
            <Route path="/" exact component={Home} />
            <Route path="/deposit" exact component={StartDeposit} />
            <Route path="/deposit/new" component={Invoice} />
            <Route path="/deposit/:address/get-address" component={GetAddress} /> 
            <Route path="/deposit/:address/pay" exact>
              <Loadable restorer="deposit">
                <Pay />
              </Loadable>
            </Route>
            <Route path="/deposit/:address/pay/confirming" render={(props) => <Loadable restorer="deposit"><Pay {...props} confirming={true} /></Loadable>} />
            <Route path="/deposit/:address/prove">
              <Loadable restorer="deposit">
                <ProveDeposit />
              </Loadable>
            </Route>
            <Route path="/deposit/:address/congratulations">
              <Loadable restorer="deposit">
                <CongratulationsDeposit />
              </Loadable>
            </Route>
            <Route path="/redeem" exact component={StartRedemption} />
            <Route path="/deposit/:address/redemption">
              <Loadable restorer="redemption"><Redeeming /></Loadable>
            </Route>
            <Route path="/deposit/:address/redemption/signing">
              <Loadable restorer="redemption"><Signing /></Loadable>
            </Route>
            <Route path="/deposit/:address/redemption/confirming">
              <Loadable restorer="redemption"><Confirming /></Loadable>
            </Route>
            <Route path="/deposit/:address/redemption/prove">
              <Loadable restorer="redemption"><ProveRedemption /></Loadable>
            </Route>
            <Route path="/deposit/:address/redemption/congratulations">
              <Loadable restorer="redemption"><CongratulationsRedemption /></Loadable>
            </Route>
          </App>
        </Web3Wrapper>
      </Router>
    </Provider>
  )
}

function LoadableBase({ children, account, setEthereumAccount, restoreDepositState, restoreRedemptionState, restorer }) {
  const { address } = useParams()
  const depositStateRestored = useSelector((state) => state[restorer].stateRestored)
  const stateAccount = useSelector((state) => state.account)

  if (account && account != stateAccount) {
    setEthereumAccount(account)
  }

  if (address && ! depositStateRestored) {
    if (stateAccount) {
      if (restorer == "deposit") {
        restoreDepositState(address)
      } else if (restorer == "redemption") {
        restoreRedemptionState(address)
      } else {
        throw "Unknown restorer."
      }
    }

    return <div>Loading...</div>
  } else {
    return children
  }
}

const Loadable = connect((_)=>{ return {} }, (dispatch) => bindActionCreators({ setEthereumAccount, restoreDepositState, restoreRedemptionState }, dispatch))(withAccount(LoadableBase))

// Compose our static Landing Page
function StaticWrapper() {
  return (
    <Provider store={store}>
      <Router history={history}>
        <App>
            <Home noEntry={true} />
        </App>
      </Router>
    </Provider>
  )
}

// Are we building a static bundle or running a live app?
let Entry

if (process.env.REACT_APP_STATIC) {
  Entry = StaticWrapper
} else {
  Entry = AppWrapper
}

// Render to DOM
window.addEventListener('load', () => {
  const rootElement = document.getElementById("root");

  if (rootElement.hasChildNodes()) {
    hydrate(<Entry />, rootElement)
  } else {
    render(<Entry />, rootElement)
  }
})
