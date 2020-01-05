const _ = require('lodash');
const express = require('express');
const conditional = require('express-conditional-middleware');
const bodyParser = require('body-parser');
const cors = require('cors');
const http = require('http');
const socketio = require('socket.io');
const nanoid = require('nanoid');
const generate = require('nanoid/generate');
const lowercase = require('nanoid-dictionary/lowercase');
const jwt = require('jsonwebtoken');
const winston = require('winston');
const moment = require('moment');

const { PORT, SECRET, CORS } = process.env;

const app = express();
const api = express.Router();
const server = http.createServer(app);
const io = socketio(server);

const connections = {};

const handleContext = (req, res, next) => {
    req.context = { subdomain: req.subdomains.reverse().join('.') };
    next();
};
const handleIdToken = (req, res) => {
    const { token } = req.body;
    const data = _.attempt(jwt.verify, token, SECRET);

    const id = _.isError(data) ? generate(lowercase, 8) : data.id;
    res.send({
        success: true,
        data: {
            token: jwt.sign({ id }, SECRET, { expiresIn: '2 days' }),
            validUntil: moment()
                .add(2, 'days')
                .toDate(),
        },
    });
};
const handleReply = (socket, id, res) => {
    const handleStatus = (status) => {
        res.status(status);
    };
    const handleHeaders = (headers) => {
        try {
            _.forEach(headers, (v, n) => res.set(n, v));
        } catch (err) {
            winston.error('error parsing headers');
            // eslint-disable-next-line no-use-before-define
            sendError(502, 'Gateway Processing Error');
        }
    };
    const handleBody = (data) => {
        // clients should send body in binary format; otherwise
        // socket.io may interpret them and modify them in-flight
        if (typeof data === 'number') {
            res.write(_.toString(data));
        } else {
            res.write(data);
        }
        // eslint-disable-next-line no-use-before-define
        setRequestTimeout();
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
            res.set('Content-Type', 'text/html; charset=utf-8')
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
    const { subdomain } = req.context;

    if (!subdomain || !(subdomain in connections)) {
        res.status(502).send('No Gateway To ' + (req.headers.host || 'unkown'));
        return;
    }

    const socket = connections[subdomain];

    const id = nanoid();
    // const id = 'debug';
    socket._messages[id] = res;

    const headers = {
        ...req.headers,
        'X-Moetaku-Req': id,
        'X-Forwarded-For': req.ip,
    };

    socket.emit(`#method-${id}`, req.method);
    socket.emit(`#url-${id}`, req.originalUrl);
    socket.emit(`#headers-${id}`, headers);

    req.on('data', (chunk) => {
        socket.emit(`#body-${id}`, Buffer.from(chunk));
    });
    req.on('end', () => {
        socket.emit(`#end-${id}`, '');
        handleReply(socket, id, res);
    });
};
const handleSetId = (socket, next) => {
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
const handleConnection = async (socket) => {
    const { moetakuId } = socket.handshake;

    socket._timeouts = {};
    socket._messages = {};
    connections[moetakuId] = socket;

    winston.info('connection established; ID: ' + moetakuId);
};

api.use(cors({ origin: CORS }))
    .use(bodyParser.json())
    .post('/api/id-token', handleIdToken);

app.enable('trust proxy')
    .use(handleContext)
    .use(conditional((req) => !req.context.subdomain, api, handleRequest));
io.use(handleSetId).on('connection', handleConnection);

server.listen(PORT, () => console.log('server ready on:', PORT));
