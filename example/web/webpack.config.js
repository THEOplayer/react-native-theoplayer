const path = require('path');
const HTMLWebpackPlugin = require('html-webpack-plugin');

const appDirectory = path.resolve(__dirname, '..');

const HTMLWebpackPluginConfig = new HTMLWebpackPlugin({
  template: path.resolve(appDirectory, './web/public/index.html'),
  filename: 'index.html',
  inject: 'body',
});

// This is needed for webpack to compile JavaScript.
// Many OSS React Native packages are not compiled to ES5 before being
// published. If you depend on uncompiled packages they may cause webpack build
// errors. To fix this webpack can be configured to compile to the necessary
// `node_module`.
const babelLoaderConfiguration = {
  test: /\.tsx?$/,
  exclude: ['/**/*.d.ts', '/**/node_modules/'],
  use: {
    loader: 'babel-loader',
    options: {
      cacheDirectory: true,
      // The 'metro-react-native-babel-preset' preset is recommended to match React Native's packager
      presets: ['module:metro-react-native-babel-preset'],
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
    // load any web API polyfills
    // path.resolve(appDirectory, 'polyfills-web.js'),
    // your web-specific entry file
    path.resolve(appDirectory, 'index.web.tsx'),
  ],

  // configures where the build ends up
  output: {
    filename: 'bundle.web.js',
    path: path.resolve(appDirectory, 'dist'),
  },

  module: {
    rules: [babelLoaderConfiguration, imageLoaderConfiguration],
  },
  resolve: {
    extensions: ['.web.js', '.web.ts', '.web.tsx', '.js', '.ts', '.tsx'],
    alias: {
      'react-native$': 'react-native-web',
      'react-native-url-polyfill': 'url-polyfill',
    },
  },
  plugins: [HTMLWebpackPluginConfig],
  devServer: {
    // Tells dev-server to open the browser after server had been started.
    open: true,
    historyApiFallback: true,
    static: [
      {
        directory: path.join(appDirectory, 'web/public'),
      },
      {
        // This is needed to also serve the node_modules/theoplayer folder.
        directory: path.join(appDirectory, '..'),
      },
    ],
    hot: true,
  },
};
