import { combineReducers } from 'redux';
import { reducer as destinationUrl } from './modules/destinationUrl';

export default (asyncReducers) => {
  return combineReducers({
    destinationUrl,
    ...asyncReducers,
  });
};
