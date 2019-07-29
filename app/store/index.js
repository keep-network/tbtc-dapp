import { createStore, applyMiddleware, compose, combineReducers } from 'redux'
import reducers from '../reducers'
import { composeWithDevTools } from 'redux-devtools-extension';
import createSagaMiddleware from 'redux-saga'
import rootSaga from '../sagas'

const composeEnhancers = composeWithDevTools({
});

const initialState = {
}

const sagaMiddleware = createSagaMiddleware()


export function configureStore(options) {
    const middleware = [
        sagaMiddleware
    ]
    const store = createStore(
        reducers,
        initialState,
        composeEnhancers(
            applyMiddleware(...middleware),
        )
    )
    sagaMiddleware.run(rootSaga)
    return store;
}