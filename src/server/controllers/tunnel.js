import _ from 'lodash';
import express from 'express';
import cors from 'cors';
import nanoid from 'nanoid';
import winston from 'winston';

const { MAX_REQ_SIZE = 24 } = process.env;

const handleReply = (socket, id, res) => {
  const handleStatus = (status) => {
    res.status(status);
  };
  const handleHeaders = (headers) => {
    try {
      _.forEach(headers, (v, n) => {
        // some of these headers are problematic so strip them
        const restrictedHeaders = [
          'connection',
          'content-encoding',
          'transfer-encoding',
        ];
        if (!restrictedHeaders.includes(_.toLower(n))) {
          res.set(n, v);
        }
      });
    } catch (err) {
      winston.error('error parsing headers');
      // eslint-disable-next-line no-use-before-define
      sendError(502, 'Gateway Processing Error');
    }
  };
  const handleBody = (data) => {
    // clients should send body in binary format; otherwise
    // socket.io may interpret them and modify them in-flight
    try {
      if (typeof data === 'number') {
        res.write(_.toString(data));
      } else {
        res.write(data);
      }
      // eslint-disable-next-line no-use-before-define
      setRequestTimeout();
    } catch (err) {
      winston.error('error handling body ' + err.message);
      // eslint-disable-next-line no-use-before-define
      sendError(502, 'Gateway Processing Error');
    }
  };
  const handleEnd = () => {
    // eslint-disable-next-line no-use-before-define
    clearHandlers();
    res.end();
  };
  const clearHandlers = () => {
    socket.removeListener(`#status-${id}`, handleStatus);
    socket.removeListener(`#headers-${id}`, handleHeaders);
    socket.removeListener(`#body-${id}`, handleBody);
    socket.removeListener(`#end-${id}`, handleEnd);

    if (id in socket._timeouts) {
      clearTimeout(socket._timeouts[id]);
    }

    delete socket._messages[id];
    delete socket._timeouts[id];
  };
  const sendError = (status, message) => {
    clearHandlers();
    if (!res.headersSent) {
      res
        .set('Content-Type', 'text/html; charset=utf-8')
        .set('Content-Length', message.length + 1)
        .status(status)
        .send(message + '\n');
    } else {
      // in case the body was already sent, close the connection
      res.connection.destroy();
    }
  };
  const setRequestTimeout = () => {
    if (id in socket._timeouts) {
      clearTimeout(socket._timeouts[id]);
    }
    socket._timeouts[id] = setTimeout(() => {
      sendError(504, 'Gateway Timeout');
    }, 60000);
  };

  setRequestTimeout();

  socket.on(`#status-${id}`, handleStatus);
  socket.on(`#headers-${id}`, handleHeaders);
  socket.on(`#body-${id}`, handleBody);
  socket.on(`#end-${id}`, handleEnd);
};

const handleRequest = async (req, res) => {
  const { subdomain, connections } = req.context;

  if (!subdomain || !(subdomain in connections)) {
    res.status(502).send('No Gateway To ' + (req.headers.host || 'unkown'));
    return;
  }

  const socket = connections[subdomain];

  if (_.keys(socket._messages).length >= MAX_REQ_SIZE) {
    res.status(503).send('Max Request Queue Size Reached: ' + MAX_REQ_SIZE);
    return;
  }

  const id = nanoid();
  socket._messages[id] = res;

  socket.emit(`#method-${id}`, req.method);
  socket.emit(`#url-${id}`, req.originalUrl);
  socket.emit(`#headers-${id}`, req.headers);

  req.on('data', (chunk) => {
    socket.emit(`#body-${id}`, Buffer.from(chunk));
  });
  req.on('end', () => {
    socket.emit(`#end-${id}`, '');
    handleReply(socket, id, res);
  });
};

export default express
  .Router()
  .use(cors({}))
  .use(handleRequest);
