import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';

const Footer = ({ className, githubUrl, issueTrackerUrl }) => {
  return (
    <div className={classnames('footer', className)}>
      <div className="footer__container">
        <div className="footer__left">
          <div>
            <a href={githubUrl} target="_blank" rel="noopener noreferrer">
              GitHub
            </a>
          </div>
          <div>
            <a href={issueTrackerUrl} target="_blank" rel="noopener noreferrer">
              Report a Bug
            </a>
          </div>
        </div>
        <div className="footer__right">© Eniz Vukovic</div>
      </div>
    </div>
  );
};

Footer.propTypes = {
  className: PropTypes.string,
  githubUrl: PropTypes.string,
  issueTrackerUrl: PropTypes.string,
};

export default React.memo(Footer);
