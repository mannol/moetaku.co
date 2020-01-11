import http from 'http';
import express from 'express';
import conditional from 'express-conditional-middleware';
import morgan from 'morgan';
import winston from 'winston';

import apiController from './controllers/api';
import tunnelController from './controllers/tunnel';
import createContextMiddleware from './middlewares/createContext';
import createErrorRendererMiddleware from './middlewares/createErrorRenderer';
import registerSocketioPlugin from './plugins/registerSocketio';

const { NODE_ENV, PORT } = process.env;

winston.configure({
  transports: [
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.colorize(),
        winston.format.printf((info) => `${info.level}: ${info.message}`),
      ),
    }),
  ],
});

const run = async () => {
  const connections = {};

  const app = express();
  const server = http.createServer(app);

  const hasSubdomainAndNotError = (req) =>
    !!req.context.subdomain && !req.context.error;

  app
    .enable('trust proxy')
    .use(
      morgan('combined', {
        stream: {
          write(msg) {
            winston.info(msg.slice(0, -1));
          },
        },
      }),
    )
    .use(createContextMiddleware({ connections }))
    .use(
      createErrorRendererMiddleware({
        app,
        hasRenderer: NODE_ENV !== 'development',
      }),
    )
    .use(conditional(hasSubdomainAndNotError, tunnelController))
    .use('/api', apiController);

  if (NODE_ENV !== 'development') {
    const renderController = (await import('./controllers/render')).default;
    app.use(renderController);
  }

  registerSocketioPlugin({ connections })(server);

  server.listen(PORT, (error) => {
    if (error) {
      winston.error('error starting server: ' + error.message);
      process.exit(1);
    } else {
      winston.info('server ready on: ' + PORT);
    }
  });
};

run();
