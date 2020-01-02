import React from 'react';

import GiphyFeature from '../components/GiphyFeature';
import Input from '../components/Input';

const handleSubmit = () => {};
const Page = () => {
  return (
    <div className="page">
      <div className="page__container">
        <GiphyFeature
          src="https://media.giphy.com/media/IFdcAnNXLG8Zq/giphy.gif"
          giphySrc="https://giphy.com/gifs/animated-pixel-art-IFdcAnNXLG8Zq"
        />
        <Input
          className="page__input"
          onSubmit={handleSubmit}
          placeholder="Enter the destination URL, i.e. http://localhost:8080"
          buttonName="START"
        ></Input>
      </div>
    </div>
  );
};

export default Page;
