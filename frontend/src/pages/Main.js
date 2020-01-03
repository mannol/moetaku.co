import React, { useState, useCallback } from 'react';

import GiphyFeature from '../components/GiphyFeature';
import Input from '../components/Input';
import Terminal from '../components/Terminal';

const handleNoop = () => {};
const Page = () => {
  const [url, setUrl] = useState();
  const handleStop = useCallback(() => setUrl(null), [setUrl]);

  return (
    <div className="page">
      <div className="page__container">
        <GiphyFeature
          src="https://media.giphy.com/media/4KayUq2zLBjby/giphy.gif"
          giphySrc="https://giphy.com/gifs/animated-pixel-art-4KayUq2zLBjby"
        />
        {url ? (
          <Terminal
            className="page__terminal"
            url="http://localhost:8080"
            buttonName="STOP"
            onToggleExpand={handleNoop}
            onStop={handleStop}
          />
        ) : (
          <Input
            // eslint-disable-next-line jsx-a11y/no-autofocus
            autoFocus={true}
            className="page__input"
            onSubmit={setUrl}
            placeholder="Enter the destination URL, i.e. http://localhost:8080"
            buttonName="START"
          />
        )}
      </div>
    </div>
  );
};

export default Page;
