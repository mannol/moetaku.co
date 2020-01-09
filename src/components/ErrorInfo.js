import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';

import HelpContainer from '../components/Help/Container';
import HelpParagraph from '../components/Help/Paragraph';
import HelpTitle from '../components/Help/Title';

const ErrorInfo = ({ title, errorsHardUrl, issueTrackerUrl, ...props }) => (
  <HelpContainer {...props}>
    <HelpTitle color="primary">{title}</HelpTitle>
    <HelpParagraph>
      Whoops! It looks like you have encountered an error. Now, I tried my best
      to describe the error here but,{' '}
      <strong>
        <a href={errorsHardUrl} target="_blank" rel="noopener noreferrer">
          it's hard
        </a>
      </strong>
      .
    </HelpParagraph>
    <HelpParagraph>
      The best I can do for now is to help you go back to the{' '}
      <strong>
        <Link to="/">home page</Link>
      </strong>
      . If you want more, try browsing the{' '}
      <strong>
        <a href={issueTrackerUrl} target="_blank" rel="noopener noreferrer">
          issue tracker
        </a>
      </strong>{' '}
      or creating an issue yourself.
    </HelpParagraph>
  </HelpContainer>
);

ErrorInfo.defaultProps = {
  title: 'Error!',
};

ErrorInfo.propTypes = {
  title: PropTypes.string,
  errorsHardUrl: PropTypes.string.isRequired,
  issueTrackerUrl: PropTypes.string.isRequired,
};

export default React.memo(ErrorInfo);
