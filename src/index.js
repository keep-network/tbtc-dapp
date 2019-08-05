import React from 'react';
import ReactDOM from 'react-dom'
import { createStore, applyMiddleware } from 'redux'
import createSagaMiddleware from 'redux-saga'
import { Provider } from 'react-redux'
import { Router, Route } from "react-router-dom";

// Styles
import './app.css'

// Components

import {
  App,
  Home,
  Start,
  Pay,
  Prove,
  Congratulations
  } from './components'

// Wrappers
import Web3Wrapper from './wrappers/web3'

// Redux
import sagas from './sagas'
import reducers from './reducers'
import history from './history'

// Set up our store
const sagaMiddleware = createSagaMiddleware()

const store = createStore(
  reducers,
  applyMiddleware(sagaMiddleware)
)

sagaMiddleware.run(sagas)

// Compose our application tree
function AppWrapper() {
  return (
    <Provider store={store}>
      <Router history={history}>
        <Web3Wrapper>
          <Route path="/" exact component={Home} />
          <App>
            <Route path="/start" component={Start} />
            <Route path="/pay" exact component={Pay} />
            <Route path="/pay/confirming" render={(props) => <Pay {...props} confirming={true} />} />
            <Route path="/prove" component={Prove} />
            <Route path="/congratulations" component={Congratulations} />
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
