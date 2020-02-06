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

const RESTORER = {
  DEPOSIT: 'deposit',
  REDEMPTION: 'redemption'
}

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
              <Loadable restorer={RESTORER.DEPOSIT}>
                <Pay />
              </Loadable>
            </Route>
            <Route path="/deposit/:address/pay/confirming" render={(props) => <Loadable restorer={RESTORER.DEPOSIT}><Pay {...props} confirming={true} /></Loadable>} />
            <Route path="/deposit/:address/prove">
              <Loadable restorer={RESTORER.DEPOSIT}>
                <ProveDeposit />
              </Loadable>
            </Route>
            <Route path="/deposit/:address/congratulations">
              <Loadable restorer={RESTORER.DEPOSIT}>
                <CongratulationsDeposit />
              </Loadable>
            </Route>
            <Route path="/redeem" exact component={StartRedemption} />
            <Route path="/deposit/:address/redemption" exact>
              <Loadable restorer={RESTORER.REDEMPTION}><Redeeming /></Loadable>
            </Route>
            <Route path="/deposit/:address/redemption/signing">
              <Loadable restorer={RESTORER.REDEMPTION}><Signing /></Loadable>
            </Route>
            <Route path="/deposit/:address/redemption/confirming">
              <Loadable restorer={RESTORER.REDEMPTION}><Confirming /></Loadable>
            </Route>
            <Route path="/deposit/:address/redemption/prove">
              <Loadable restorer={RESTORER.REDEMPTION}><ProveRedemption /></Loadable>
            </Route>
            <Route path="/deposit/:address/redemption/congratulations">
              <Loadable restorer={RESTORER.REDEMPTION}><CongratulationsRedemption /></Loadable>
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
      if (restorer == RESTORER.DEPOSIT) {
        restoreDepositState(address)
      } else if (restorer == RESTORER.REDEMPTION) {
        restoreRedemptionState(address)
      } else {
        throw "Unknown restorer."
      }
    }

    return <div>Loading...</div>
  } else {
    // FIXME How do we not render these if we're getting ready to transition to
    // FIXME a new page?
    return children
  }
}

const mapDispatchToProps = (dispatch) => {
  return bindActionCreators(
    {
      setEthereumAccount,
      restoreDepositState,
      restoreRedemptionState
    },
    dispatch
  );
}

const Loadable = connect(null, mapDispatchToProps)(withAccount(LoadableBase))

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
