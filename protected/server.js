/**
 * environment params:
 * APPLICATION - application to launch
 * PORT - application server port to listen
 * NODE_ENV - application environment (development, testing, production)
 */

'use strict';
require('./core/fatalHandler');

import cors from 'cors';
import fs from 'fs';
import path from 'path';
import URL from 'url';
import express from 'express';
import bodyParser from 'body-parser';
import colors from 'colors';
import webpack from 'webpack';
import cookieParser from 'cookie-parser';
import errorHandler from './core/errorHandler';
import axios from 'axios';
import apiEndpoints from './routes/apiEndpoints';

const DEFAULT_PORT  = 3000;
const app           = express();
const jsonParser    = bodyParser.json();


let allowCrossDomain = (req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE, PATCH');
  res.header('Access-Control-Allow-Headers', 'Content-Type');
  next();
}

/**
 * Init parsers
 */
app.use(cookieParser());
app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
  extended: true
}));
app.use(bodyParser.json());
app.use(errorHandler.errorExceptionHandler);
app.use(allowCrossDomain);

/**
 * Set API endpoints
 */
app.use('/api', apiEndpoints);
app.use('/build', express.static(path.join(__dirname, 'build')));


app.listen(process.env.PORT || DEFAULT_PORT, () => {
  const msg = "Server is listening on " + (process.env.PORT || DEFAULT_PORT) + ' port';
  console.log(msg.rainbow);
});
