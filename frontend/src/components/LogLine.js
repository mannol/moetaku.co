import React, { useCallback, Fragment } from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import { UnmountClosed } from 'react-collapse';
import { FiChevronDown, FiPlay } from 'react-icons/fi';

import * as constants from '../constants';

const LogLine = ({
  id,
  title,
  details,
  code,
  status,
  duration,
  isExpanded,
  onToggleExpand,
}) => {
  const isComplete = status !== constants.LOG_STATUS_PENDING;
  const isSuccess = status === constants.LOG_STATUS_SUCCESS;
  const isError = [
    constants.LOG_STATUS_FAILURE,
    constants.LOG_STATUS_TIMEOUT,
  ].includes(status);

  const handleToggleExpand = useCallback(
    () => onToggleExpand(id, !isExpanded),
    [id, isExpanded, onToggleExpand],
  );

  return (
    <div className="log-line">
      <button
        className="log-line__status-button"
        disabled={!isComplete}
        onClick={handleToggleExpand}
      >
        {!isComplete && <FiPlay className="log-line__pending-icon" />}
        {isComplete && (
          <div
            className={classnames({
              'log-line__status-code--success': isSuccess,
              'log-line__status-code--failure': isError,
            })}
          >
            {code === -1 ? 'ERR' : code}
          </div>
        )}
        <div className="log-line__status">
          {title}
          {!!duration && (
            <span className="log-line__duration">{duration} ms</span>
          )}
        </div>
        {isComplete && (
          <FiChevronDown
            className={classnames('log-line__chevron-icon', {
              'log-line__chevron-icon--expanded': isExpanded,
            })}
          />
        )}
      </button>
      <UnmountClosed isOpened={isExpanded}>
        <div className="log-line__details">
          {details.map((detail, index) => (
            <p key={index}>
              {detail &&
                detail.split('\n').map((line, lineIdx) => (
                  <Fragment key={lineIdx}>
                    {line}
                    <br />
                  </Fragment>
                ))}
            </p>
          ))}
        </div>
      </UnmountClosed>
    </div>
  );
};

LogLine.defaultProps = {
  details: [],
};

LogLine.propTypes = {
  id: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  details: PropTypes.arrayOf(PropTypes.string),
  code: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  status: PropTypes.oneOf([
    constants.LOG_STATUS_PENDING,
    constants.LOG_STATUS_SUCCESS,
    constants.LOG_STATUS_FAILURE,
    constants.LOG_STATUS_TIMEOUT,
  ]),
  duration: PropTypes.number.isRequired,
  isExpanded: PropTypes.bool,
  onToggleExpand: PropTypes.func.isRequired,
};

export default LogLine;
