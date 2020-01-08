import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';

const Component = ({ className, ...props }) => (
  <div className={classnames('help__code', className)}>
    <code {...props} />
  </div>
);

Component.propTypes = {
  className: PropTypes.string,
};

export default Component;
