import _ from 'lodash';
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

const { STATIC_PATH, APP_URL } = process.env;
const indexHtmlPath = path.resolve(STATIC_PATH, 'index.html');
const normalizedAppUrl = _.trimEnd(APP_URL, '/');

const render = (req, res) => {
  const { error } = req.context;

  fs.readFile(indexHtmlPath, 'utf8', (err, indexHtml) => {
    if (err) {
      winston.error('read error: ' + err.message);
      return res.status(404).send('Not Found');
    }

    const store = createStore({});

    const html = ReactDOMServer.renderToString(
      <Provider store={store}>
        <StaticRouter location={error ? '*' : req.url} context={req.context}>
          <App />
        </StaticRouter>
      </Provider>,
    );

    let resHtml = indexHtml.replace(
      '<div id="root"></div>',
      `<div id="root">${html}</div>`,
    );

    if (error) {
      // don't send .js bundle for error responses
      resHtml = resHtml.replace(
        /<script src="\/static\/js\/(.*).chunk.js"><\/script>/g,
        '',
      );

      // point root (/) assets to main domain
      resHtml = resHtml.replace(
        /href="\/(\/)?/g,
        'href="' + normalizedAppUrl + '/',
      );
    }

    return res.status(error ? error.status : 200).send(resHtml);
  });
};

const interceptErrorRender = (req, res, next) => {
  if (req.context.error) {
    render(req, res);
  } else {
    next();
  }
};

export default express
  .Router()
  .use(interceptErrorRender)
  .get('^/$', render)
  .use(express.static(path.resolve(STATIC_PATH), { maxAge: '30d' }))
  .use('*', (req, res) => {
    if (!res.headersSent) {
      res.renderError(404, 'Not Found');
    }
  });
