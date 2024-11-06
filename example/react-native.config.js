const path = require('path');
const pkg = require('../package.json');

module.exports = {
  dependencies: {
    'react-native-google-cast': {
      platforms: {
        ios: null, // this will disable autolinking for this package on iOS
      },
    },
    [pkg.name]: {
      root: path.join(__dirname, '..'),
    },
  },
};
