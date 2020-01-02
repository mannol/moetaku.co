import React from 'react';
import PropTypes from 'prop-types';

const Component = ({ src, giphySrc }) => (
  <div className="giphy-feature">
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

Component.propTypes = {
  src: PropTypes.string.isRequired,
  giphySrc: PropTypes.string.isRequired,
};

export default React.memo(Component);
