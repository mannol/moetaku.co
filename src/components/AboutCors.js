import React from 'react';
import PropTypes from 'prop-types';

import HelpContainer from '../components/Help/Container';
import HelpCode from '../components/Help/Code';
import HelpParagraph from '../components/Help/Paragraph';
import HelpTitle from '../components/Help/Title';

const AboutCors = ({
  whatIsCorsUrl,
  howToConfigureCorsUrl,
  currentLocation,
  ...props
}) => (
  <HelpContainer {...props}>
    <HelpTitle color="dark-red">About CORS</HelpTitle>
    <HelpParagraph>
      Being created using technologies provided by modern browsers, it is
      impossible to create (or use) TCP sockets for direct manipulation.
      Instead, XHR and WebSocket interfaces are used for forwarding traffic.
    </HelpParagraph>
    <HelpParagraph>
      Because of that, all traffic is limited by browsers internal safety
      mechanisms, such as{' '}
      <a href={whatIsCorsUrl} target="_blank" rel="noopener noreferrer">
        CORS
      </a>
      . Any complex HTTP request may require preflight OPTIONS request and,
      depending on the WebServer configuration, may be blocked by the browser.
    </HelpParagraph>
    <HelpParagraph>
      That being said, most simple use cases, such as loading React apps, are
      going to work out of the box. However, if your WebApp is using an API or
      if your WebServer serves non-basic requests in any way, you will have to
      configure CORS policy explicitly. There are plenty of resources online on{' '}
      <a href={howToConfigureCorsUrl} target="_blank" rel="noopener noreferrer">
        how to configure your WebServer CORS policy
      </a>{' '}
      but, for the best moetaku.co experience, send these headers:
      <HelpCode>
        Access-Control-Allow-Origin: {currentLocation}
        <br />
        Access-Control-Allow-Credentials: *<br /> Access-Control-Allow-Headers:
        *<br />
        Access-Control-Allow-Methods: *<br /> Access-Control-Expose-Headers: *
        <br />
      </HelpCode>
    </HelpParagraph>
    <HelpParagraph color="dark-red">
      <strong>
        USING WILDCARD CORS HEADERS IN PRODUCTION IS A SECURITY VULNERABILITY!
      </strong>
    </HelpParagraph>
    <HelpParagraph>
      NOTE: For better user experience, moetaku.co intercepts OPTIONS request
      from the client accessing public resource. This may affect your App
      behaviour.
    </HelpParagraph>
  </HelpContainer>
);

AboutCors.propTypes = {
  whatIsCorsUrl: PropTypes.string.isRequired,
  howToConfigureCorsUrl: PropTypes.string.isRequired,
  currentLocation: PropTypes.string.isRequired,
};

export default React.memo(AboutCors);
