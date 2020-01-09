import express from 'express';
import path from 'path';

const { STATIC_PATH } = process.env;

export default express
  .Router()
  .use(express.static(path.resolve(STATIC_PATH), { maxAge: '30d' }));
