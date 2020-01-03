import _ from 'lodash';
import React from 'react';
import PropTypes from 'prop-types';

import LogLine from './LogLine';

const Component = ({ lines, onToggleExpand }) => (
  <>
    {lines.map((line) => (
      <LogLine {...line} key={line.id} onToggleExpand={onToggleExpand} />
    ))}
  </>
);

Component.propTypes = {
  lines: PropTypes.arrayOf(
    PropTypes.shape(_.omit(LogLine.propTypes, 'onToggleExpand')),
  ).isRequired,
  onToggleExpand: PropTypes.func.isRequired,
};

export default Component;
