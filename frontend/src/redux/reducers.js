import { combineReducers } from 'redux';
import { reducer as destinationUrl } from './modules/destinationUrl';
import { reducer as logs } from './modules/logs';
import { reducer as proxyUrl } from './modules/proxyUrl';

export default (asyncReducers) => {
  return combineReducers({
    destinationUrl,
    logs,
    proxyUrl,
    ...asyncReducers,
  });
};
