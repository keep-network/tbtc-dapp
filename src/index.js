import React from 'react';
import ReactDOM from 'react-dom'
import { createStore, applyMiddleware } from 'redux'
import createSagaMiddleware from 'redux-saga'
import { Provider } from 'react-redux'
import { Router, Route } from 'react-router-dom'
import { persistStore, persistReducer } from 'redux-persist'
import { PersistGate } from 'redux-persist/integration/react'
import storage from 'redux-persist/lib/storage'

// Styles
import './app.css'

// Components
import {
  App,
  Home,
  Start,
  Invoice,
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

const persistConfig = {
  key: 'root',
  storage,
}
const persistedReducer = persistReducer(persistConfig, reducers)

const store = createStore(
  persistedReducer,
  applyMiddleware(sagaMiddleware)
)
const persistor = persistStore(store)

sagaMiddleware.run(sagas)

async function checkForResetStateFlag() {
  let params = (new URL(document.location)).searchParams;
  let resetState = !!params.get("_resetState");
  if(resetState) {
    console.log('_resetState is set, purging cached Redux store')
    await persistor.purge()
  }
}

// Compose our application tree
function AppWrapper() {
  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <Router history={history}>
          <Web3Wrapper>
            <App>
              <Route path="/" exact component={Home} />
              <Route path="/start" component={Start} />
              <Route path="/invoice" component={Invoice} />
              <Route path="/pay" exact component={Pay} />
              <Route path="/pay/confirming" render={(props) => <Pay {...props} confirming={true} />} />
              <Route path="/prove" component={Prove} />
              <Route path="/congratulations" component={Congratulations} />
            </App>
          </Web3Wrapper>
        </Router>
      </PersistGate>
    </Provider>
  )
}

// Render to DOM
window.addEventListener('load', async () => {
  await checkForResetStateFlag()
  ReactDOM.render(<AppWrapper />, document.getElementById('root'))
})
