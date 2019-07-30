import React from 'react';
import ReactDOM from 'react-dom'
import App from './components/App'
import './app.css'

import { createStore, applyMiddleware } from 'redux'
import createSagaMiddleware from 'redux-saga'
import { Provider } from 'react-redux'

import sagas from './sagas'
import reducers from './reducers'

const sagaMiddleware = createSagaMiddleware()

const store = createStore(
  reducers,
  applyMiddleware(sagaMiddleware)
)

sagaMiddleware.run(sagas)

ReactDOM.render(<Provider store={store}><App /></Provider>, document.getElementById('root'))
