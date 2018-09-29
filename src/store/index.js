import { createStore, compose, combineReducers, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import { connectRouter, routerMiddleware } from 'connected-react-router';
import * as reducers from './reducers';
import history from '../history';

const isDev = process.env.NODE_ENV === 'development';

const middleware = [routerMiddleware(history), thunk];

const composeEnhancer = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

const rootReducer = combineReducers({ ...reducers });

const store = createStore(
  connectRouter(history)(rootReducer),
  isDev
    ? composeEnhancer(applyMiddleware(...middleware))
    : applyMiddleware(...middleware)
);

if (module.hot) {
  // Reload reducers
  module.hot.accept('./reducers', () => {
    store.replaceReducer(connectRouter(history)(rootReducer));
  });
}

export default store;
