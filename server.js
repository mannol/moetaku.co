#!/usr/bin/env node

require('dotenv').config();
require('ignore-styles');

const presets =
  process.env.NODE_ENV === 'development'
    ? ['@babel/preset-env']
    : ['@babel/preset-env', '@babel/preset-react'];

const plugins = [
  '@babel/plugin-proposal-class-properties',
  ['@babel/plugin-transform-runtime', { regenerator: true }],
];

require('@babel/register')({
  ignore: [/(node_modules)/],
  presets,
  plugins,
});

require('./src/server');
