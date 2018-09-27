import { createStore, compose, combineReducers, applyMiddleware } from 'redux';
import houseList from './reducers/houseList';
import thunk from 'redux-thunk';

const isDev = process.env.NODE_ENV === 'development';

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
const rootRedux = combineReducers({ houseList });

const store = createStore(
  rootRedux,
  isDev ? composeEnhancers(applyMiddleware(thunk)) : applyMiddleware(thunk)
);

export default store;
