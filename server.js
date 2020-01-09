#!/usr/bin/env node

require('dotenv').config();
require('ignore-styles');

const reactAppPreset =
  process.env.NODE_ENV === 'development' ? [] : ['react-app'];

require('@babel/register')({
  ignore: [/(node_modules)/],
  presets: ['@babel/preset-env', ...reactAppPreset],
});

require('./src/server');
