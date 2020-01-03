import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';

import Logs from './Logs';
import * as constants from '../constants';

const exampleLines = [
  {
    id: '1',
    title: 'GET /example/',
    status: constants.LOG_STATUS_PENDING,
    isExpanded: true,
    duration: 0,
    code: -1,
    message:
      'GET /example/\nHTTP 2\nlocation: https://www.google.com/\ncontent-type: text/html; charset=UTF-8',
  },
  {
    id: '2',
    title: 'GET /graphql/',
    status: constants.LOG_STATUS_SUCCESS,
    duration: 230,
    code: 200,
    message:
      'GET /example/\nHTTP 2\nlocation: https://www.google.com/\ncontent-type: text/html; charset=UTF-8',
  },
  {
    id: '3',
    title:
      'Connecting Connecting Connecting Connecting Connecting Connecting Connecting Connecting Connecting Connecting ',
    status: constants.LOG_STATUS_FAILURE,
    duration: 3000,
    code: 404,
  },
];

const Component = ({
  className,
  destinationUrl,
  proxyUrl,
  buttonName,
  onToggleExpand,
  onStop,
}) => {
  return (
    <div className={classnames('terminal', className)}>
      <div className="terminal__container">
        <div
          className={classnames('terminal__connection-info', {
            'terminal__connection-info--visible': !!proxyUrl,
          })}
        >
          Available at: {proxyUrl && <a href={proxyUrl}>{proxyUrl}</a>}
        </div>
        <div className="terminal__status">
          <span className="terminal__status-url">{destinationUrl}</span>
          <button className="btn btn__red" onClick={onStop}>
            {buttonName}
          </button>
        </div>
        <div className="terminal__logs">
          <Logs lines={exampleLines} onToggleExpand={onToggleExpand}></Logs>
        </div>
      </div>
    </div>
  );
};

Component.propTypes = {
  className: PropTypes.string.isRequired,
  destinationUrl: PropTypes.string.isRequired,
  proxyUrl: PropTypes.string.isRequired,
  buttonName: PropTypes.string.isRequired,
  onToggleExpand: PropTypes.func.isRequired,
  onStop: PropTypes.func.isRequired,
};

export default Component;
