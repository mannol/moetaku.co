import React from 'react';
import ReactDOMServer from 'react-dom/server';
import { Provider } from 'react-redux';
import { StaticRouter } from 'react-router-dom';
import fs from 'fs';
import path from 'path';
import express from 'express';
import winston from 'winston';

import createStore from '../../redux/store';
import App from '../../App';

const { STATIC_PATH } = process.env;

const render = (req, res) => {
  const indexHtmlPath = path.resolve(STATIC_PATH, 'index.html');

  fs.readFile(indexHtmlPath, 'utf8', (err, indexHtml) => {
    if (err) {
      winston.error('read error: ' + err.message);
      return res.status(404).end();
    }

    const store = createStore({});

    const html = ReactDOMServer.renderToString(
      <Provider store={store}>
        <StaticRouter location={req.url}>
          <App />
        </StaticRouter>
      </Provider>,
    );

    return res.send(
      indexHtml.replace(
        '<div id="root"></div>',
        `<div id="root">${html}</div>`,
      ),
    );
  });
};

export default express.Router().use('^/$', render);
