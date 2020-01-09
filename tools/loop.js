#!/usr/bin/env node

//
// :: Simple testing utility that both listens and sends requests
//

const _ = require('lodash');
const express = require('express');
const cors = require('cors');
const fetch = require('node-fetch');

const [, script, url, port] = process.argv;

if (!url || !port) {
  console.error(`Usage: ${script} <URL> <PORT>`);
  process.exit(1);
}

const methods = ['GET', 'HEAD', 'POST', 'PUT', 'DELETE'];
const body = (method) =>
  ['POST', 'PUT'].includes(method) ? { data: 'data' } : null;

const loop = async () => {
  console.log('[i] running loop; press <ctrl+c> to interrupt');

  let count = 0;
  while (true) {
    const batchSize = _.random(1, 5, false);
    const method = _.sample(methods);
    await Promise.all(
      _.times(batchSize, () =>
        fetch(url, { method, body: body(method) }).catch(_.noop),
      ),
    );

    count += batchSize;
    process.stdout.write('\rRequests sent: ' + count);
  }
};

express()
  .use(cors({}), (req, res) => res.send({ success: true }))
  .listen(port, loop);
