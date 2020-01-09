import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';

const HelpParagraph = ({ className, color, ...props }) => (
  <p className={classnames('help__paragraph', color, className)} {...props} />
);

HelpParagraph.propTypes = {
  className: PropTypes.string,
  color: PropTypes.string,
  bold: PropTypes.bool,
};

export default HelpParagraph;
