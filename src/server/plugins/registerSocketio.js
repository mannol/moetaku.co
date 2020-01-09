import _ from 'lodash';
import socketio from 'socket.io';
import jwt from 'jsonwebtoken';
import winston from 'winston';

const { SECRET } = process.env;

const resolveId = (socket, next) => {
  const { token } = socket.handshake.query;
  try {
    const data = jwt.verify(token, SECRET);

    if (!data.id) {
      throw new Error('missing id from handshake token');
    }

    socket.handshake.moetakuId = data.id;
    next();
  } catch (err) {
    winston.error('client tried to connect with invalid token: ' + token);
    next(err);
  }
};

const handleConnection = (context) => (socket) => {
  const { connections } = context;
  const { moetakuId } = socket.handshake;

  const existing = connections[moetakuId];
  if (existing) {
    existing.disconnect();
  }

  socket._timeouts = {};
  socket._messages = {};
  connections[moetakuId] = socket;

  winston.info('connection established; ID: ' + moetakuId);

  socket.on('disconnect', () => {
    winston.info('connection lost; ID: ' + moetakuId);

    _.forEach(socket._messages, (res) => {
      if (!res.headersSent) {
        res.status(504).send('Gateway Timeout\n');
      } else {
        // in case the body was already sent, close the connection
        res.connection.destroy();
      }
    });

    _.forEach(socket._timeouts, clearTimeout);

    if (connections[moetakuId] === socket) {
      delete connections[moetakuId];
    }
  });
};

export default (context) => (server) => {
  socketio(server)
    .use(resolveId)
    .on('connection', handleConnection(context));
};
