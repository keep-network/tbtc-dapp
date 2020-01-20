import React from 'react';
import { render, hydrate } from 'react-dom'
import { createStore, applyMiddleware } from 'redux'
import createSagaMiddleware from 'redux-saga'
import routerMiddleware from './lib/router/middleware'
import notificationMiddleware from './lib/notifications/middleware'
import { Provider, useSelector } from 'react-redux'
import { Router, Route, useParams } from 'react-router-dom'

// Styles
import './app.css'

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
import { restoreDepositState } from './actions';
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
              <Loadable>
                <Pay />
              </Loadable>
            </Route>
            <Route path="/deposit/:address/pay/confirming" render={(props) => <Loadable><Pay {...props} confirming={true} /></Loadable>} />
            <Route path="/deposit/:address/prove">
              <Loadable>
                <ProveDeposit />
              </Loadable>
            </Route>
            <Route path="/deposit/:address/congratulations" component={CongratulationsDeposit} />
            <Route path="/redeem" exact component={StartRedemption} />
            <Route path="/redeem/redeeming" component={Redeeming} />
            <Route path="/redeem/signing" component={Signing} />
            <Route path="/redeem/confirming" component={Confirming} />
            <Route path="/redeem/prove" component={ProveRedemption} />
            <Route path="/redeem/congratulations" component={CongratulationsRedemption} />
          </App>
        </Web3Wrapper>
      </Router>
    </Provider>
  )
}

function LoadableBase({ children, account, restoreDepositState }) {
  const { address } = useParams()
  const depositStateRestored = useSelector((state) => state.deposit.stateRestored)
  if (address && ! depositStateRestored) {
    if (account) {
      restoreDepositState(address)
    }

    return <div>Loading...</div>
  } else {
    return children
  }
}

const Loadable = connect((_)=>{ return {} }, (dispatch) => bindActionCreators({ restoreDepositState }, dispatch))(withAccount(LoadableBase))

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
