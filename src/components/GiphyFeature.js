import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';

const GiphyFeature = ({ className, src, giphySrc }) => (
  <div className={classnames('giphy-feature', className)}>
    <img className="giphy-feature__img" alt="Feature Gif" src={src} />
    <a
      target="_blank"
      rel="noopener noreferrer"
      className="giphy-feature__src"
      href={giphySrc}
    >
      via GIPHY
    </a>
  </div>
);

GiphyFeature.propTypes = {
  className: PropTypes.string,
  src: PropTypes.string.isRequired,
  giphySrc: PropTypes.string.isRequired,
};

export default React.memo(GiphyFeature);
