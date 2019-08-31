import React from 'react';
import ReactDOM from 'react-dom'
import { createStore, applyMiddleware } from 'redux'
import createSagaMiddleware from 'redux-saga'
import routerMiddleware from './lib/router/middleware'
import notificationMiddleware from './lib/notifications/middleware'
import { Provider } from 'react-redux'
import { Router, Route } from 'react-router-dom'

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
  Pay,
  Prove,
  Congratulations as CongratulationsDeposit
} from './components/deposit'


// Wrappers
import Web3Wrapper from './wrappers/web3'

// Redux
import sagas from './sagas'
import reducers from './reducers'
import history from './history'

// Set up our store
const sagaMiddleware = createSagaMiddleware()
const middleware = [
  routerMiddleware,
  notificationMiddleware,
  sagaMiddleware,
]

const store = createStore(
  reducers,
  applyMiddleware(...middleware)
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
            <Route path="/deposit/" exact component={StartDeposit} />
            <Route path="/deposit/start" component={StartDeposit} />
            <Route path="/deposit/invoice" component={Invoice} />
            <Route path="/deposit/pay" exact component={Pay} />
            <Route path="/deposit/pay/confirming" render={(props) => <Pay {...props} confirming={true} />} />
            <Route path="/deposit/prove" component={Prove} />
            <Route path="/deposit/congratulations" component={CongratulationsDeposit} />
          </App>
        </Web3Wrapper>
      </Router>
    </Provider>
  )
}

// Render to DOM
window.addEventListener('load', () => {
  ReactDOM.render(<AppWrapper />, document.getElementById('root'))
})
