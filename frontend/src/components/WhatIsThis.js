import React from 'react';
import PropTypes from 'prop-types';

import HelpContainer from '../components/Help/Container';
import HelpParagraph from '../components/Help/Paragraph';
import HelpTitle from '../components/Help/Title';

const Component = ({ githubUrl, ...props }) => (
  <HelpContainer {...props}>
    <HelpTitle color="primary">What is this?</HelpTitle>
    <HelpParagraph>
      Moetaku.co is an <strong>http tunnel</strong> that helps you{' '}
      <strong>tunnel</strong> your <strong>local http traffic</strong> via{' '}
      <strong>public interface</strong>.
    </HelpParagraph>
    <HelpParagraph>
      It is especially useful for developers who want to showcase their work to
      collegues without the hassle of hosting work-in-progress anywhere. Similar
      tools for more advance usages exist (such as ngrok) but, moetaku.co tries
      to be simple to use for very limited usecase.
    </HelpParagraph>
    <HelpParagraph>
      <strong>
        Moetaku.co is also{' '}
        <a href={githubUrl} target="_blank" rel="noopener noreferrer">
          open source
        </a>
      </strong>
      , so you can host it yourself.
    </HelpParagraph>
  </HelpContainer>
);

Component.propTypes = {
  githubUrl: PropTypes.string.isRequired,
};

export default Component;
