import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';

const Component = ({ className, color, ...props }) => (
  <p className={classnames('help__title', color, className)} {...props} />
);

Component.propTypes = {
  className: PropTypes.string,
  color: PropTypes.oneOf(['primary', 'purple', 'dark-red']),
};

export default Component;
