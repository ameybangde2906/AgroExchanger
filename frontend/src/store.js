import { createStore, combineReducers, applyMiddleware } from 'redux';
import {thunk} from 'redux-thunk';
import userReducer from './reducers/userReducer';
import orderReducer from './reducers/orderReducer';
import negotiationReducer from './reducers/negotiationReducer';

const rootReducer = combineReducers({
  user: userReducer,
  orders: orderReducer,
  negotiations: negotiationReducer,
});

const store = createStore(rootReducer, applyMiddleware(thunk));

export default store;
