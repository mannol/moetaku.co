import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';

const HelpContainer = ({ className, ...props }) => (
  <div className={classnames('help', className)} {...props} />
);

HelpContainer.propTypes = {
  className: PropTypes.string,
};

export default HelpContainer;
