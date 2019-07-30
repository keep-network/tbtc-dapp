import React from 'react';
import ReactDOM from 'react-dom'
import { createStore, applyMiddleware } from 'redux'
import createSagaMiddleware from 'redux-saga'
import { Provider } from 'react-redux'
import { BrowserRouter as Router, Route } from "react-router-dom";

import App from './components/App'
import './app.css'

import sagas from './sagas'
import reducers from './reducers'
import {
  Home,
  Start,
  Pay,
  Prove,
  Congratulations
  } from './components'

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
      <Router>
        <App>
          <Route path="/" exact component={Home} />
          <Route path="/start" component={Start} />
          <Route path="/pay" exact component={Pay} />
          <Route path="/pay/confirming" render={(props) => <Pay {...props} confirming={true} />} />
          <Route path="/prove" component={Prove} />
          <Route path="/congratulations" component={Congratulations} />
        </App>
      </Router>
    </Provider>
  )
}

// Render to DOM
ReactDOM.render(<AppWrapper />, document.getElementById('root'))
