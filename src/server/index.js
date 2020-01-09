import http from 'http';
import express from 'express';
import conditional from 'express-conditional-middleware';
import morgan from 'morgan';
import winston from 'winston';

import apiController from './controllers/api';
import tunnelController from './controllers/tunnel';
import createContextMiddleware from './middlewares/createContext';
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

  const hasSubdomain = (req) => !!req.context.subdomain;

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
    .use(conditional(hasSubdomain, tunnelController))
    .use('/api', apiController);

  if (NODE_ENV !== 'development') {
    const renderController = (await import('./controllers/render')).default;
    const staticController = (await import('./controllers/static')).default;

    app.use(renderController).use(staticController);
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
