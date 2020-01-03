import { generate as createId } from 'shortid';
import { put, takeLatest } from 'redux-saga/effects';
import * as constants from '../../constants';

import { setDestinationUrl } from './destinationUrl';
import { setProxyUrl } from './proxyUrl';
import { createLogLine, updateLogLine } from './logs';

///////////////////////////////////////////////////////////////////////////////
//
// :: CONSTANTS
//
///////////////////////////////////////////////////////////////////////////////
const CREATE_CONNECTION = 'CREATE_CONNECTION';
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

///////////////////////////////////////////////////////////////////////////////
//
// :: SAGAS
//
///////////////////////////////////////////////////////////////////////////////
const doConnection = function*({ payload }) {
  const sleep = () => new Promise((resolve) => setTimeout(resolve, 2000));

  const logId = createId();
  const startTime = Date.now();

  try {
    yield put(
      createLogLine({
        id: logId,
        title: 'connecting',
        code: -1,
        status: constants.LOG_STATUS_PENDING,
        duration: 0,
      }),
    );
    yield put(setDestinationUrl(payload.destinationUrl));

    // CONNECT
    yield sleep();

    const proxyUrl = 'https://fjdkaij.moetaku.co';

    yield put(setProxyUrl(proxyUrl));
    yield put(
      updateLogLine(logId, {
        title: 'connection established',
        details: [`Connection established; public URL: ${proxyUrl}`],
        code: 200,
        status: constants.LOG_STATUS_SUCCESS,
        duration: Date.now() - startTime,
      }),
    );
  } catch (err) {
    yield put(
      updateLogLine(logId, {
        title: 'connection established',
        code: 200,
        status: constants.LOG_STATUS_SUCCESS,
        duration: Date.now() - startTime,
      }),
    );
  }
};

export const sagas = function*() {
  yield takeLatest(CREATE_CONNECTION, doConnection);
};
