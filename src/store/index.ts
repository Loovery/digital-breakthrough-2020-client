import {createStore, applyMiddleware} from 'redux';

import reducer from './reducer';
import thunk from 'redux-thunk';

const store = createStore(reducer, applyMiddleware(thunk));

const getState = () => {
  return store.getState();
};

export {store, getState};

export default {
  store,
  getState,
};
