import { createStore, applyMiddleware, compose, combineReducers } from 'redux'
import reducers from '../reducers'
import { composeWithDevTools } from 'redux-devtools-extension';

const composeEnhancers = composeWithDevTools({
});

const initialState = {
}

export function configureStore(options) {
    const middleware = [
    ]
    const store = createStore(
        reducers,
        initialState,
        composeEnhancers(
            applyMiddleware(...middleware),
        )
    )
    return store;
}