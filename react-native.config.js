/**
 * @type {import('@react-native-community/cli-types').UserDependencyConfig}
 */
module.exports = {
  dependency: {
    platforms: {
      android: {
        cmakeListsPath: '../android/src/newarch/jni/CMakeLists.txt',
      },
    },
  },
};
