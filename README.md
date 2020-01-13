# [moetaku.co](https://moetaku.co)

Moetaku is an **http tunnel** that helps you **tunnel** your **local http traffic** via **public interface**.

It is especially useful for developers who want to showcase their work to colleagues without the hassle of hosting work-in-progress anywhere. Similar tools (such as ngrok) for more advance usage exist but, moetaku tries to be simple to use for its purpose.

# How it works?

Moetaku uses `socket.io` & `fetch` to tunnel HTTP requests. This diagram shows the path each request makes:

```
[internet]        [moetaku.co]-(WS con)-[your browser]        [target]
    |  1- REQ -->      |                      |                   |
    |                  |    2- REQ (WS)-->    |                   |
    |                  |                      | 3- REQ (fetch)--> |
    |                  |                      | <--RES (fetch) -4 |
    |                  |    <--RES (WS) -5    |                   |
    |  <-- RES -5      |                      |                   |
```

1. The client issues a request; by opening `example.moetaku.co` in his browser for example
2. Moetaku receives the requests and looks up if there's a browser waiting for `example.moetaku.co` requests. If there is a browser waiting, the request is serialized and sent via WS to the browser.
3. Browser receives the requests, parses the data and creates a fetch request to the configured target.
4. If the target is available, they will respond to the request
5. Browser, then, serializes the response and sends it to moetaku via WS
6. Moetaku receives the response and forwards it to the agent that made the initial request.

# Caveats

The tunnel should work out-of-the-box for common use cases, like showcasing react/vue/angular apps. However, being based on web technologies, there are few things to consider:

1. Target server should allow `Origin: https://moetaku.co` in its CORS settings
2. For best user experience target server should also send these headers as a CORS preflight response:
   ```http
   Access-Control-Allow-Credentials: *
   Access-Control-Allow-Headers: *
   Access-Control-Allow-Methods: *
   Access-Control-Expose-Headers: *
   ```
3. For convenience, `moetaku.co` will intercept OPTIONS request and reply to the original request (**1.**) instead of passing it down to the client.

# Development

This project was bootstrapped with [create-react-app](https://github.com/facebook/create-react-app).

Project has the following structure:

- **public/** - public assets
- **src/**
  - **components/** - react components
  - **constants/** - enum definitions
  - **pages/** - react router pages
  - **redux/**
    - **modules/**
      - **connection.js** - tunnel business logic and Proxy interface
      - **\*.js** - common redux store logic
    - **actions.js** - exports modules actions
    - **reducers.js** - exports and configures modules' reducers
    - **sagas.js** - exports and configures modules' sagas
    - **selectors.js** - exports modules' selectors
    - **store.js** - configure redux store
  - **scss/** - styles
  - **util/** - utilities, like Proxy logic
  - **server/** - all the backend code is here
- **tools/** - some helper tools; like `loop.js` testing utility

### Running production server

Just execute `yarn start`

### Running development server

For react dev server, run: `yarn start:dev:fe`
For node dev server, run: `yarn start:dev:be`

[**TIP**]: I recommended running local DNS server with following configuration: `moetaku-local.co -> 127.0.0.1` & `*.moetaku-local.co -> 127.0.0.1`. In short, you want to forward all traffic, including traffic coming from subdomains to your servers.

`moetaku-local.co:3000` should render an app
`moetaku-local.co:5000` & `*.moetaku-local.co:5000` should point to the server

# Contributing

Everyone is open to contribute. Make sure to write decent code and commit messages.

# License

MIT

# Copyright

(C) Eniz Vukovic & contributors
