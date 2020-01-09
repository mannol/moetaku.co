import { combineReducers } from 'redux';
import { reducer as connection } from './modules/connection';
import { reducer as destinationUrl } from './modules/destinationUrl';
import { reducer as logs } from './modules/logs';
import { reducer as proxyUrl } from './modules/proxyUrl';

export default (asyncReducers) => {
  return combineReducers({
    connection,
    destinationUrl,
    logs,
    proxyUrl,
    ...asyncReducers,
  });
};
