/* eslint-disable flowtype/require-parameter-type */
// @flow
/**
 *
 */
require('es6-promise').polyfill();
require('isomorphic-fetch');
import express from 'express';
import graphQLHTTP from 'express-graphql';
import path from 'path';
import webpack from 'webpack';
import WebpackDevServer from 'webpack-dev-server';
import {schema} from './data/schema';
import {renderToString} from 'react-dom/server';
import App from './js/app';
import html from './html';

const APP_PORT: number = 3000;

// Serve the Relay app
// Calling webpack() without a callback as 2nd property returns a Compiler object.
// The libdefs don't like it, but it's fine.  $FlowFixMe https://webpack.js.org/api/node/
const compiler: webpack.Compiler = webpack({
  mode: 'development',
  entry: ['whatwg-fetch', path.resolve(__dirname, 'js', 'index.js')],
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
        },
      },
    ],
  },
  output: {
    filename: 'app.js',
    path: '/',
  },
  resolve: {
    preferRelative: true,
  },
});

const app: WebpackDevServer = new WebpackDevServer(compiler, {
  contentBase: '/public/',
  publicPath: '/js/',
  stats: {colors: true},
});

// Serve static resources
app.use('/public', express.static(path.resolve(__dirname, 'public')));

// Setup GraphQL endpoint
app.use(
  '/graphql',
  graphQLHTTP({
    schema: schema,
    pretty: true,
  }),
);

app.use('/', async (req, res) => {
  const appString = renderToString(App);

  res.send(
    html({
      body: appString,
      title: 'Woovi Challenge - Relay • Todo',
    }),
  );
});

app.listen(APP_PORT, () => {
  console.log(`App is now running on http://localhost:${APP_PORT}`);
});
