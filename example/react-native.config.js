module.exports = {
  dependencies: {
    'react-native-google-cast': {
      platforms: {
        // iOS needs to disable autolinking for this package and add an explicit dependency to
        // https://github.com/Danesz/react-native-google-cast.git', branch: 'feature/guestmode_apple_silicon'
        // in Podfile.
        ios: null,

        // Android should auto-link its peer dependency from @theoplayer/react-native-ui
        android: {},
      },
    },
  },
};
