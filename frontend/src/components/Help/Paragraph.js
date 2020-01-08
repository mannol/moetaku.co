import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';

const Component = ({ className, color, ...props }) => (
  <p className={classnames('help__paragraph', color, className)} {...props} />
);

Component.propTypes = {
  className: PropTypes.string,
  color: PropTypes.string,
  bold: PropTypes.bool,
};

export default Component;
