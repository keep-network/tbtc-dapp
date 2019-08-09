import { combineReducers } from 'redux'

import app from './app.js'
import modal from './modal.js'

const reducers = combineReducers({ app, modal })

export default reducers