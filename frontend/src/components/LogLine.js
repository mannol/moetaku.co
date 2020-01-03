import React, { useCallback } from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import { UnmountClosed } from 'react-collapse';
import { FiChevronDown, FiPlay } from 'react-icons/fi';

import * as constants from '../constants';

const Component = ({
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
            {code}
          </div>
        )}
        <div className="log-line__status">{title}</div>
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
            <p key={index}>{detail}</p>
          ))}
        </div>
      </UnmountClosed>
    </div>
  );
};

Component.defaultProps = {
  details: [],
};

Component.propTypes = {
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

export default Component;
