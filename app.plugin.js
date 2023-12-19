/**
 * Expo plugin for react-native-theoplayer.
 */
const { withProjectBuildGradle } = require('@expo/config-plugins');

const withAndroidTHEOplayerGradle = (config) => {
  const localMaven = 'maven { url("$rootDir/../node_modules/react-native-theoplayer/android/local") }';

  return withProjectBuildGradle(config, (config) => {
    // Add the localMaven repo to the project's repositories
    config.modResults.contents = config.modResults.contents.replace(
        /allprojects\s*\{\s*repositories\s*\{/,
        `$&\n\t\t${localMaven}`
    )
    return config;
  });
};

module.exports = (config) => {
  return withAndroidTHEOplayerGradle(config);
};
