/* eslint-disable @typescript-eslint/no-var-requires,no-undef */
const path = require('path');
const HTMLWebpackPlugin = require('html-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');

const pkg = require('../../package.json');
const projectDirectory = path.resolve(__dirname, '../..');
const appDirectory = path.resolve(__dirname, '..');

const HTMLWebpackPluginConfig = new HTMLWebpackPlugin({
  template: path.resolve(appDirectory, './web/public/index.html'),
  filename: 'index.html',
  inject: 'body',
});

// THEOplayer's libraryLocation.
const libraryLocation = 'theoplayer';

// Webpack's output location
const outputLocation = 'dist';

const CopyWebpackPluginConfig = new CopyWebpackPlugin({
  patterns: [
    {
      // Copy transmuxer worker files.
      // THEOplayer will find them by setting `libraryLocation` in the playerConfiguration.
      from: path.resolve(appDirectory, './node_modules/theoplayer/THEOplayer.transmux.*').replace(/\\/g, '/'),
      to: `${libraryLocation}/[name][ext]`,
    },
    {
      // Copy service worker
      // THEOplayer will find them by setting `libraryLocation` in the playerConfiguration.
      from: path.resolve(appDirectory, './node_modules/theoplayer/theoplayer.sw.js').replace(/\\/g, '/'),
      to: `${libraryLocation}/[name][ext]`,
    },
  ],
});

// This is needed for webpack to compile JavaScript.
// Many OSS React Native packages are not compiled to ES5 before being
// published. If you depend on uncompiled packages they may cause webpack build
// errors. To fix this webpack can be configured to compile to the necessary
// `node_module`.
const babelLoaderConfiguration = {
  test: [/\.[jt]sx?$/],
  exclude: [/\.d\.ts$/, /node_modules[/\\](?!react-native-cavynext)/],
  use: {
    loader: 'babel-loader',
    options: {
      cacheDirectory: true,
      // The '@react-native/babel-preset' preset is recommended to match React Native's packager
      presets: ['module:@react-native/babel-preset'],
      // Re-write paths to import only the modules needed by the app
      plugins: ['react-native-web'],
    },
  },
};

// This is needed for webpack to import static images in JavaScript files.
const imageLoaderConfiguration = {
  test: /\.(gif|jpe?g|png|svg)$/,
  use: {
    loader: 'react-native-web-image-loader',
  },
};

module.exports = {
  entry: [
    // The app entry file. When run via `cavynext run-web`, the CLI swaps
    // `index.test.web.js` into place here.
    path.resolve(appDirectory, 'index.web.js'),
  ],

  // configures where the build ends up
  output: {
    filename: 'bundle.web.js',
    path: path.resolve(appDirectory, outputLocation),
  },

  module: {
    rules: [babelLoaderConfiguration, imageLoaderConfiguration],
  },
  resolve: {
    extensions: ['.web.js', '.web.ts', '.web.tsx', '.js', '.ts', '.tsx'],
    alias: {
      // Resolve react-native-theoplayer to its TypeScript source in the repo root.
      [pkg.name]: path.resolve(projectDirectory, pkg.source),

      'react-native$': 'react-native-web',
      'react-native-web': path.resolve(appDirectory, 'node_modules/react-native-web'),
      'react-native-svg': path.resolve(appDirectory, 'node_modules/react-native-svg-web'),

      // Avoid duplicate react env.
      react: path.resolve(appDirectory, 'node_modules/react'),
    },
  },
  plugins: [HTMLWebpackPluginConfig, CopyWebpackPluginConfig],
  devServer: {
    // Tells dev-server to open the browser after server had been started.
    open: true,
    historyApiFallback: true,
    static: [
      {
        directory: path.join(appDirectory, 'web/public'),
      },
    ],
    hot: true,
    client: {
      overlay: {
        errors: true,
        warnings: false,
        runtimeErrors: false,
      },
    },
  },
};
