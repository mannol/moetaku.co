import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';

const Component = ({ className, ...props }) => (
  <code className={classnames('help__code', className)} {...props} />
);

Component.propTypes = {
  className: PropTypes.string,
};

export default Component;
