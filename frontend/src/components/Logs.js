import _ from 'lodash';
import React from 'react';
import PropTypes from 'prop-types';

import LogLine from './LogLine';

const Component = ({ logs, onToggleExpand }) => (
  <>
    {logs.map((line) => (
      <LogLine {...line} key={line.id} onToggleExpand={onToggleExpand} />
    ))}
  </>
);

Component.propTypes = {
  logs: PropTypes.arrayOf(
    PropTypes.shape(_.omit(LogLine.propTypes, 'onToggleExpand')),
  ).isRequired,
  onToggleExpand: PropTypes.func.isRequired,
};

export default Component;
