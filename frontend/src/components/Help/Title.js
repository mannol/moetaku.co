import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';

const HelpTitle = ({ className, color, ...props }) => (
  <p className={classnames('help__title', color, className)} {...props} />
);

HelpTitle.propTypes = {
  className: PropTypes.string,
  color: PropTypes.oneOf(['primary', 'purple', 'dark-red']),
};

export default HelpTitle;
