import React, { useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';

import { selectDestinationUrl, selectProxyUrl } from '../redux/selectors';
import { setDestinationUrl } from '../redux/actions';

import GiphyFeature from '../components/GiphyFeature';
import Input from '../components/Input';
import Terminal from '../components/Terminal';

const handleNoop = () => {};
const Page = () => {
  const dispatch = useDispatch();

  const destinationUrl = useSelector(selectDestinationUrl);
  const proxyUrl = useSelector(selectProxyUrl);

  const handleSetDestinationUrl = useCallback(
    (url) => dispatch(setDestinationUrl(url)),
    [dispatch],
  );
  const handleStopProxy = useCallback(() => dispatch(setDestinationUrl(null)), [
    dispatch,
  ]);

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
            onToggleExpand={handleNoop}
            onStop={handleStopProxy}
          />
        ) : (
          <Input
            // eslint-disable-next-line jsx-a11y/no-autofocus
            autoFocus={true}
            className="page__input"
            onSubmit={handleSetDestinationUrl}
            placeholder="Enter the destination URL, i.e. http://localhost:8080"
            buttonName="START"
          />
        )}
      </div>
    </div>
  );
};

export default Page;
