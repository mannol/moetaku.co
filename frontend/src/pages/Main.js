import React, { useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';

import {
  selectDestinationUrl,
  selectProxyUrl,
  selectLogs,
} from '../redux/selectors';
import {
  createConnection,
  closeConnection,
  updateLogLine,
} from '../redux/actions';

import Footer from '../components/Footer';
import GiphyFeature from '../components/GiphyFeature';
import Input from '../components/Input';
import Terminal from '../components/Terminal';
import WhatIsThis from '../components/WhatIsThis';
import AboutCors from '../components/AboutCors';

const Page = () => {
  const dispatch = useDispatch();

  const destinationUrl = useSelector(selectDestinationUrl);
  const proxyUrl = useSelector(selectProxyUrl);
  const logs = useSelector(selectLogs);

  const handleSetDestinationUrl = useCallback(
    (url) => dispatch(createConnection(url)),
    [dispatch],
  );
  const handleStopProxy = useCallback(() => dispatch(closeConnection()), [
    dispatch,
  ]);
  const handleLogLineToggleExpand = useCallback(
    (id, nextState) => dispatch(updateLogLine(id, { isExpanded: nextState })),
    [dispatch],
  );

  return (
    <div className="page">
      <div className="page__container">
        <GiphyFeature
          src="https://media.giphy.com/media/4KayUq2zLBjby/giphy.gif"
          giphySrc="https://giphy.com/gifs/animated-pixel-art-4KayUq2zLBjby"
        />
        {destinationUrl ? (
          <Terminal
            className="page__terminal"
            destinationUrl={destinationUrl}
            proxyUrl={proxyUrl}
            buttonName="STOP"
            onToggleExpand={handleLogLineToggleExpand}
            onStop={handleStopProxy}
            logs={logs}
          />
        ) : (
          <Input
            // eslint-disable-next-line jsx-a11y/no-autofocus
            autoFocus={true}
            className="page__input"
            onSubmit={handleSetDestinationUrl}
            placeholder="Enter the destination URL, i.e. http://localhost:8080"
            defaultValue="http://localhost:7898"
            buttonName="START"
          />
        )}
        <WhatIsThis
          className="page__help"
          githubUrl="https://github.com/mannol/moetaku.co"
        />
        <AboutCors
          className="page__help"
          whatIsCorsUrl="https://www.codecademy.com/articles/what-is-cors"
          howToConfigureCorsUrl="https://www.google.com/search?q=how+to+configure+cors+in+%5BENTER+YOUR+TECH+STACK+HERE%5D"
        />
      </div>
      <Footer
        githubUrl="https://github.com/mannol/moetaku.co"
        issueTrackerUrl="https://github.com/mannol/moetaku.co/issues"
      />
    </div>
  );
};

export default Page;
