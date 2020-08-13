'use strict';

const nodeExternals = require('webpack-node-externals');
const TsconfigPathsPlugin = require('tsconfig-paths-webpack-plugin');
const NodemonPlugin = require('nodemon-webpack-plugin');
const path = require('path');
const Dotenv = require('dotenv-webpack');

module.exports = {
  entry: './src/main.ts',
  output: {
    path: path.join(__dirname, 'dist'),
    filename: 'main.js',
  },
  target: 'node',
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        loader: 'ts-loader',
      },
    ],
  },
  optimization: { minimize: false },
  resolve: {
    extensions: ['.ts', 'tsx', '.js'],
    plugins: [new TsconfigPathsPlugin({ configFile: 'tsconfig.json' })],
  },
  plugins: [new NodemonPlugin(), new Dotenv()],
  // externals: [nodeExternals()],
  devtool: 'source-map',
};
