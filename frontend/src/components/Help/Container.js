import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';

const Component = ({ className, ...props }) => (
  <div className={classnames('help', className)} {...props} />
);

Component.propTypes = {
  className: PropTypes.string,
};

export default Component;
