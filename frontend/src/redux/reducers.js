import { combineReducers } from 'redux';
// import { reducer as confirmEmail } from './modules/confirmEmail';

export default (asyncReducers) => {
  return combineReducers({
    // confirmEmail,
    ...asyncReducers,
  });
};
