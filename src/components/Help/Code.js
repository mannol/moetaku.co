import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';

const HelpCode = ({ className, ...props }) => (
  <code className={classnames('help__code', className)} {...props} />
);

HelpCode.propTypes = {
  className: PropTypes.string,
};

export default HelpCode;
