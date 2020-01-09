import { createStore, applyMiddleware } from 'redux';
import createSagaMiddleware from 'redux-saga';
import { composeWithDevTools } from 'redux-devtools-extension/developmentOnly';

import createReducer from './reducers';
import sagas from './sagas';

const configureStore = (initialState) => {
  const rootReducer = createReducer({});
  const sagaMiddleware = createSagaMiddleware();

  const middlewares = [sagaMiddleware];

  const store = createStore(
    rootReducer,
    initialState,
    composeWithDevTools(applyMiddleware(...middlewares)),
  );

  sagas.map(sagaMiddleware.run);

  return store;
};

export default configureStore;
