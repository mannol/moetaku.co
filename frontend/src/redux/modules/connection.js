import _ from 'lodash';
import nanoid from 'nanoid';
import { eventChannel, buffers } from 'redux-saga';
import { put, takeLatest, call, take, select, race } from 'redux-saga/effects';

import * as constants from '../../constants';
import Proxy from '../../util/Proxy';

import { setDestinationUrl } from './destinationUrl';
import { setProxyUrl } from './proxyUrl';
import { createLogLine, updateLogLine, clearLogs } from './logs';

///////////////////////////////////////////////////////////////////////////////
//
// :: CONSTANTS
//
///////////////////////////////////////////////////////////////////////////////
const CREATE_CONNECTION = 'CREATE_CONNECTION';
const CREATE_CONNECTION_LOADING = 'CREATE_CONNECTION_LOADING';
const CREATE_CONNECTION_SUCCESS = 'CREATE_CONNECTION_SUCCESS';
const CREATE_CONNECTION_FAILURE = 'CREATE_CONNECTION_FAILURE';
const CREATE_CONNECTION_LOST = 'CREATE_CONNECTION_LOST';
const CLOSE_CONNECTION = 'CLOSE_CONNECTION';

///////////////////////////////////////////////////////////////////////////////
//
// :: ACTIONS
//
///////////////////////////////////////////////////////////////////////////////
export const createConnection = (destinationUrl) => {
  return {
    type: CREATE_CONNECTION,
    payload: {
      destinationUrl,
    },
  };
};
export const closeConnection = () => {
  return {
    type: CLOSE_CONNECTION,
  };
};

const createConnectionLoading = () => {
  return {
    type: CREATE_CONNECTION_LOADING,
    payload: {
      logId: nanoid(),
      startTime: Date.now(),
    },
  };
};
const createConnectionSuccess = (url) => {
  return {
    type: CREATE_CONNECTION_SUCCESS,
    payload: {
      url,
    },
  };
};
const createConnectionFailure = (error) => {
  return {
    type: CREATE_CONNECTION_FAILURE,
    payload: {
      error,
    },
  };
};
const createConnectionLost = () => {
  return {
    type: CREATE_CONNECTION_LOST,
    payload: {
      logId: nanoid(),
      startTime: Date.now(),
    },
  };
};

///////////////////////////////////////////////////////////////////////////////
//
// :: REDUCER
//
///////////////////////////////////////////////////////////////////////////////
const defaultState = {};

export const reducer = (state = defaultState, action) => {
  switch (action.type) {
    case CREATE_CONNECTION_LOADING:
    case CREATE_CONNECTION_LOST:
      return { ...state, attempt: action.payload };
    case CREATE_CONNECTION_SUCCESS:
    case CREATE_CONNECTION_FAILURE:
      return {
        ...state,
        attempt: { ...state.attempt, ...action.payload },
      };
    default:
      return state;
  }
};

///////////////////////////////////////////////////////////////////////////////
//
// :: SELECTORS
//
///////////////////////////////////////////////////////////////////////////////
export const selectConnectionAttempt = (store) => store.connection.attempt;

///////////////////////////////////////////////////////////////////////////////
//
// :: SAGAS
//
///////////////////////////////////////////////////////////////////////////////
const createProxyChannel = (destinationUrl) =>
  eventChannel((emit) => {
    const proxy = new Proxy({ destinationUrl });

    proxy.on(Proxy.ON_CONNECT, (url) => emit(createConnectionSuccess(url)));
    proxy.on(Proxy.ON_CONNECT_ERROR, (err) =>
      emit(createConnectionFailure(err)),
    );
    proxy.on(Proxy.ON_DISCONNECT, () => emit(createConnectionLost()));
    proxy.on(Proxy.ON_REQUEST, (msg) =>
      emit(
        createLogLine({
          id: msg.id,
          title: `${_.toUpper(msg.method)} ${msg.url}`,
          details: [
            `>>> ${_.toUpper(msg.method)} ${msg.url}`,
            _.map(msg.headers, (val, key) => `${key}: ${val}`).join('\n'),
          ],
        }),
      ),
    );
    proxy.on(Proxy.ON_RESPONSE, (res) =>
      emit(
        updateLogLine(res.request.id, {
          details: [
            `<<< ${_.toUpper(res.status)}`,
            _.map(res.headers, (val, key) => `${key}: ${val}`).join('\n'),
          ],
          code: res.status,
          status:
            res.status < 400
              ? constants.LOG_STATUS_SUCCESS
              : constants.LOG_STATUS_FAILURE,
          duration: Date.now() - res.request.startTime,
        }),
      ),
    );
    proxy.on(Proxy.ON_PROXY_ERROR, (err) =>
      emit(
        updateLogLine(err.request.id, {
          details: [
            '! Error: ' + err.errorMessage + '; check console for more info.',
          ],
          status: constants.LOG_STATUS_FAILURE,
          duration: Date.now() - err.request.startTime,
        }),
      ),
    );

    emit(createConnectionLoading());
    proxy.connect();

    return () => proxy.close();
  }, buffers.expanding(10));

const doConnectionLoading = function*(payload) {
  const { logId, destinationUrl } = payload;

  yield put(
    createLogLine({
      id: logId,
      title: 'Connecting',
    }),
  );

  yield put(setDestinationUrl(destinationUrl));
};

const doConnectionSuccess = function*(payload) {
  const { destinationUrl } = payload;
  const { logId, url, startTime } = yield select(selectConnectionAttempt);

  yield put(
    updateLogLine(logId, {
      title: 'Connection established',
      details: [
        `Now forwarding requests from public URL: ${url} to -> ${destinationUrl}`,
      ],
      code: 200,
      status: constants.LOG_STATUS_SUCCESS,
      duration: Date.now() - startTime,
    }),
  );

  yield put(setProxyUrl(url));
};

const doConnectionFailure = function*() {
  const { logId, error, startTime } = yield select(selectConnectionAttempt);
  yield put(
    updateLogLine(logId, {
      title: 'Connection failed',
      details: [`Failed to connect to proxy server`, '"' + error.message + '"'],
      status: constants.LOG_STATUS_FAILURE,
      duration: Date.now() - startTime,
    }),
  );
};

const doConnectionLost = function*(payload) {
  const { logId } = payload;
  yield put(
    createLogLine({
      id: logId,
      title: 'Reconnecting',
      details: [`Connection to proxy server lost`],
    }),
  );

  yield put(setProxyUrl(null));
};

const doConnection = function*({ payload }) {
  const channel = yield call(createProxyChannel, payload.destinationUrl);

  try {
    const stateMachine = {
      CREATE_CONNECTION_LOADING: doConnectionLoading,
      CREATE_CONNECTION_SUCCESS: doConnectionSuccess,
      CREATE_CONNECTION_FAILURE: doConnectionFailure,
      CREATE_CONNECTION_LOST: doConnectionLost,
    };

    while (true) {
      const [action, stop] = yield race([
        take(channel),
        take(CLOSE_CONNECTION),
      ]);

      if (stop) {
        yield put(setProxyUrl(null));
        yield put(setDestinationUrl(null));
        yield put(clearLogs());
        break;
      }

      yield put(action);

      const handler = stateMachine[action.type];

      if (handler) {
        yield handler({ ...payload, ...action.payload });
      }
    }
  } finally {
    channel.close();
  }
};

export const sagas = function*() {
  yield takeLatest(CREATE_CONNECTION, doConnection);
};
