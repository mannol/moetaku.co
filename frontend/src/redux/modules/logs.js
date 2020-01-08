import _ from 'lodash';
import nanoid from 'nanoid';
import * as constants from '../../constants';

///////////////////////////////////////////////////////////////////////////////
//
// :: CONSTANTS
//
///////////////////////////////////////////////////////////////////////////////
const CREATE_LOG_LINE = 'CREATE_LOG_LINE';
const UPDATE_LOG_LINE = 'UPDATE_LOG_LINE';
const CLEAR_LOGS = 'CLEAR_LOGS';

///////////////////////////////////////////////////////////////////////////////
//
// :: ACTIONS
//
///////////////////////////////////////////////////////////////////////////////
export const createLogLine = (line) => {
  return {
    type: CREATE_LOG_LINE,
    payload: {
      line: {
        id: nanoid(),
        title: '',
        details: [],
        code: -1,
        status: constants.LOG_STATUS_PENDING,
        duration: 0,
        ...line,
      },
    },
  };
};
export const updateLogLine = (id, updates) => {
  return {
    type: UPDATE_LOG_LINE,
    payload: {
      id,
      updates,
    },
  };
};
export const clearLogs = () => {
  return {
    type: CLEAR_LOGS,
  };
};

///////////////////////////////////////////////////////////////////////////////
//
// :: REDUCER
//
///////////////////////////////////////////////////////////////////////////////
const defaultState = [];

export const reducer = (state = defaultState, action) => {
  switch (action.type) {
    case CREATE_LOG_LINE:
      return [action.payload.line, ...state].slice(0, 1000);
    case UPDATE_LOG_LINE:
      const idx = _.findIndex(state, ['id', action.payload.id]);
      if (idx === -1) {
        return state;
      }
      const el = {
        ...state[idx],
        ...action.payload.updates,
        details: _.concat(state[idx].details, action.payload.updates.details),
      };
      return [...state.slice(0, idx), el, ...state.slice(idx + 1)];
    case CLEAR_LOGS:
      return [];
    default:
      return state;
  }
};

///////////////////////////////////////////////////////////////////////////////
//
// :: SELECTORS
//
///////////////////////////////////////////////////////////////////////////////
export const selectLogs = (store) => store.logs;
