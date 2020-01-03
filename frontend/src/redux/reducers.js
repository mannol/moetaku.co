import { combineReducers } from 'redux';
import { reducer as destinationUrl } from './modules/destinationUrl';
import { reducer as proxyUrl } from './modules/proxyUrl';

export default (asyncReducers) => {
  return combineReducers({
    destinationUrl,
    proxyUrl,
    ...asyncReducers,
  });
};
