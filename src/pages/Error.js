import React from 'react';
import PropTypes from 'prop-types';

import Footer from '../components/Footer';
import GiphyFeature from '../components/GiphyFeature';
import ErrorInfo from '../components/ErrorInfo';

const Error = ({ title, staticContext }) => {
  const errorTitle =
    staticContext && staticContext.error ? staticContext.error.message : title;

  return (
    <div className="page">
      <div className="page__container">
        <GiphyFeature
          className="page__feature"
          src="https://media.giphy.com/media/4KayUq2zLBjby/giphy.gif"
          giphySrc="https://giphy.com/gifs/animated-pixel-art-4KayUq2zLBjby"
        />
        <ErrorInfo
          className="page__help"
          title={errorTitle}
          errorsHardUrl="https://xkcd.com/1024/"
          issueTrackerUrl="https://github.com/mannol/moetaku.co/issues"
        />
      </div>
      <Footer
        githubUrl="https://github.com/mannol/moetaku.co"
        issueTrackerUrl="https://github.com/mannol/moetaku.co/issues"
      />
    </div>
  );
};

Error.propTypes = {
  title: PropTypes.string,
  staticContext: PropTypes.any,
};

export default Error;
