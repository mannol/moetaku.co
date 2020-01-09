import _ from 'lodash';
import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import generate from 'nanoid/generate';
import lowercase from 'nanoid-dictionary/lowercase';
import jwt from 'jsonwebtoken';

const { CORS, SECRET } = process.env;
const TWO_DAYS = 86400000 * 2;

const handleCreateProxy = (req, res) => {
  const { host } = req.headers;
  const { token } = req.body;

  if (!host) {
    res.status(400).send('Missing Host Header');
    return;
  }

  const data = _.attempt(jwt.verify, token, SECRET);

  const id = _.isError(data) ? generate(lowercase, 8) : data.id;
  res.send({
    success: true,
    data: {
      url: 'https://' + id + '.' + host,
      token: jwt.sign({ id }, SECRET, { expiresIn: '2 days' }),
      validUntil: new Date(Date.now() + TWO_DAYS),
    },
  });
};

export default express
  .Router()
  .use(cors({ origin: CORS }))
  .use(bodyParser.json())
  .post('/proxy', handleCreateProxy);
