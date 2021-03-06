import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';

import Logs from './Logs';

const Terminal = ({
  className,
  destinationUrl,
  proxyUrl,
  buttonName,
  logs,
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
          Available at:{' '}
          {proxyUrl && (
            <a href={proxyUrl} target="_blank" rel="noopener noreferrer">
              {proxyUrl}
            </a>
          )}
        </div>
        <div className="terminal__status">
          <div className="terminal__status-url">{destinationUrl}</div>
          <button className="btn btn__red" onClick={onStop}>
            {buttonName}
          </button>
        </div>
        <div className="terminal__logs">
          <Logs logs={logs} onToggleExpand={onToggleExpand}></Logs>
        </div>
      </div>
    </div>
  );
};

Terminal.propTypes = {
  className: PropTypes.string.isRequired,
  destinationUrl: PropTypes.string.isRequired,
  proxyUrl: PropTypes.string,
  buttonName: PropTypes.string.isRequired,
  logs: Logs.propTypes.logs,
  onToggleExpand: PropTypes.func.isRequired,
  onStop: PropTypes.func.isRequired,
};

export default Terminal;
