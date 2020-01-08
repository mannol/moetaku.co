import React from 'react';
import PropTypes from 'prop-types';

import HelpContainer from '../components/Help/Container';
import HelpCode from '../components/Help/Code';
import HelpParagraph from '../components/Help/Paragraph';
import HelpTitle from '../components/Help/Title';

const Component = ({ whatIsCorsUrl, howToConfigureCorsUrl, ...props }) => (
  <HelpContainer {...props}>
    <HelpTitle color="dark-red">About CORS</HelpTitle>
    <HelpParagraph>
      Being based on technologies provided by modern browsers, it's impossible
      to create (or use) TCP sockets for direct manipulation. What is available
      instead are XHR and WebSocket interfaces which moetaku.co is using for
      forwarding traffic.
    </HelpParagraph>
    <HelpParagraph>
      Because XHR is used to forward requests from a public endpoint, it means
      that all traffic is limited by browsers internal safety mechanisms, most
      notably{' '}
      <a href={whatIsCorsUrl} target="_blank" rel="noopener noreferrer">
        CORS
      </a>
      . In addition, any complex request may require preflight OPTIONS request
      and, depending on the WebServer configuration, may be blocked.
    </HelpParagraph>
    <HelpParagraph>
      That being said, most simple use cases, such as loading React apps, are
      going to work out of the box. However, if your WebApp is using an API or
      if your WebServer serves non-basic requests in any way, you will have to
      allow CORS. There are plenty of resources online on{' '}
      <a href={howToConfigureCorsUrl} target="_blank" rel="noopener noreferrer">
        how to configure your WebServer to allow CORS
      </a>{' '}
      but, for the best moetaku.co experience, send these headers:
      <HelpCode>
        Access-Control-Allow-Origin: {window.location.href}
        <br />
        Access-Control-Allow-Credentials: *<br /> Access-Control-Allow-Headers:
        *<br />
        Access-Control-Allow-Methods: *<br /> Access-Control-Expose-Headers: *
        <br />
      </HelpCode>
    </HelpParagraph>
    <HelpParagraph color="dark-red">
      <strong>
        USING WILDCARD CORS HEADERS IN PRODUCTION IS A SECURITY VULNERABILITY
        AND SHOULD BE DISABLED!
      </strong>
    </HelpParagraph>
  </HelpContainer>
);

Component.propTypes = {
  whatIsCorsUrl: PropTypes.string.isRequired,
  howToConfigureCorsUrl: PropTypes.string.isRequired,
};

export default Component;
