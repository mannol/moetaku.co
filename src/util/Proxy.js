import _ from 'lodash';
import io from 'socket.io-client';
import ioWildcard from 'socketio-wildcard';
import EventEmitter from 'eventemitter3';

const { REACT_APP_API_URL } = process.env;
const MAX_RETRIES = 10;

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

class Proxy extends EventEmitter {
  static ON_CONNECT = 'ON_CONNECT';
  static ON_CONNECT_ERROR = 'ON_CONNECT_ERROR';
  static ON_DISCONNECT = 'ON_DISCONNECT';
  static ON_REQUEST = 'ON_REQUEST';
  static ON_RESPONSE = 'ON_RESPONSE';
  static ON_PROXY_ERROR = 'ON_PROXY_ERROR';

  constructor(options) {
    super();
    this.messages = {};
    this.destinationUrl = _.trim(options.destinationUrl, '/');
    this.abortController = new AbortController();
    this.retryCounter = 0;

    this.handleConnect = this.handleConnect.bind(this);
    this.handleConnectError = this.handleConnectError.bind(this);
    this.handleDisconnect = this.handleDisconnect.bind(this);
    this.handleData = this.handleData.bind(this);
  }
  async announce() {
    const cacheKey = 'proxy:' + this.destinationUrl;
    const apiUrl = new URL(REACT_APP_API_URL);
    apiUrl.pathname = '/api/proxy';

    const cached = JSON.parse(localStorage.getItem(cacheKey) || '{}');

    if (cached.validUntil && new Date(cached.validUntil) > new Date()) {
      return cached;
    }

    const res = await fetch(apiUrl.href, { method: 'POST', body: cached });

    if (!res.ok) {
      throw new Error('api call failed');
    }

    const { success, data } = await res.json();

    if (!success) {
      throw new Error('error generating id token');
    }

    localStorage.setItem(cacheKey, JSON.stringify(data));
    return data;
  }
  async connect() {
    if (this.socket) {
      return;
    }

    try {
      const { url, token } = await this.announce();

      this.url = url;
      this.socket = io(REACT_APP_API_URL, {
        query: { token },
        reconnection: false,
      });
      ioWildcard(io.Manager)(this.socket);

      this.socket.on('connect', this.handleConnect);
      this.socket.on('connect_error', this.handleConnectError);
      this.socket.on('disconnect', this.handleDisconnect);
      this.socket.on('*', this.handleData);
    } catch (err) {
      this.handleConnectError(err);
    }
  }
  async reconnect() {
    this.close();

    await sleep(1000);

    return this.connect();
  }
  close() {
    if (this.socket) {
      this.socket.removeAllListeners();
      this.socket.close();
      this.socket = null;
    }
    this.messages = {};
    this.abortController.abort();
  }

  handleConnect() {
    this.emit(Proxy.ON_CONNECT, this.url);
    this.retryCounter = 0;
  }
  handleConnectError(err) {
    if (++this.retryCounter >= MAX_RETRIES) {
      this.emit(Proxy.ON_CONNECT_ERROR, err);
      this.retryCounter = 0;
    } else {
      this.reconnect();
    }
  }
  handleDisconnect() {
    this.emit(Proxy.ON_DISCONNECT);
    this.reconnect();
  }
  async handleData({ data }) {
    const [event, payload] = data;
    const [type, ...idParts] = event.split('-');
    const id = idParts.join('-');

    if (!id) {
      console.warn('ignoring invalid server message', type);
      return;
    }

    const message = (this.messages[id] = this.messages[id] || {
      id,
      startTime: Date.now(),
    });

    switch (type) {
      case '#method':
        message.method = payload;
        break;
      case '#url':
        message.url = payload;
        break;
      case '#headers':
        message.headers = payload;
        break;
      case '#body':
        message.body = message.body ? message.body + payload : payload;
        break;
      case '#end':
        await this.flushMessage(message);
        break;
      default:
        console.warn('ignoring unkown server message', type);
    }
  }
  async flushMessage(message) {
    this.emit(Proxy.ON_REQUEST, message);

    try {
      const res = await fetch(this.destinationUrl + message.url, {
        method: message.method,
        headers: message.headers,
        body: message.body,
        redirect: 'manual',
        signal: this.abortController.signal,
      });

      if (!(message.id in this.messages)) {
        // connection was dropped before, ignore this reply
        return;
      }

      const headers = {};
      const reader = res.body.getReader();

      res.headers.forEach((v, k) => (headers[k] = v));

      this.socket.emit(`#status-${message.id}`, res.status);
      this.socket.emit(`#headers-${message.id}`, headers);

      const readBody = () =>
        reader.read().then(({ done, value }) => {
          if (done) {
            this.socket.emit(`#end-${message.id}`, '');
            this.emit(Proxy.ON_RESPONSE, {
              request: message,
              status: res.status,
              headers,
            });
            return Promise.resolve();
          }
          this.socket.emit(`#body-${message.id}`, Buffer.from(value));
          return readBody();
        });

      await readBody();
    } catch (err) {
      if (!(message.id in this.messages)) {
        // connection was dropped before, ignore this reply
        return;
      }

      this.socket.emit(`#status-${message.id}`, 502);
      this.socket.emit(`#headers-${message.id}`, {
        'content-type': 'text/html',
        'content-length': 11,
      });
      this.socket.emit(`#body-${message.id}`, 'Bad Gateway');
      this.socket.emit(`#end-${message.id}`, '');

      this.emit(Proxy.ON_PROXY_ERROR, {
        request: message,
        errorMessage: err.message,
      });
    }
  }
}

export default Proxy;
