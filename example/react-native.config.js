module.exports = {
  dependencies: {
    'react-native-google-cast': {
      platforms: {
        // we need to disable auto-linking for this and add an explicit dependency to the ios target in the podfile,
        // because tvOS does not support react-native-google-cast
        ios: null,
        // Android should auto-link its peer dependency from @theoplayer/react-native-ui
        android: {},
      },
    },
  },
};
