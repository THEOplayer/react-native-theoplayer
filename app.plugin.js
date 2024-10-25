/**
 * Expo plugin for react-native-theoplayer.
 *
 * Example:
 *     "plugins": [
 *         ["react-native-theoplayer", {
 *             "extensions": ["ima", "dai", "cast"]
 *         }]
 *     ]
 */
const { withProjectBuildGradle, withGradleProperties } = require('@expo/config-plugins');

function mapAndroidExtensionKey(ext) {
  switch (ext) {
    case 'ima':
      return 'THEOplayer_extensionGoogleIMA';
    case 'dai':
      return 'THEOplayer_extensionGoogleDAI';
    case 'cast':
      return 'THEOplayer_extensionCast';
    default:
      return undefined;
  }
}

const applyAndroidExtensions = (config, extensions) => {
  return withGradleProperties(config, (config) => {
    extensions?.forEach((ext) => {
      const key = mapAndroidExtensionKey(ext);
      if (key) {
        config.modResults.push({ type: 'property', key, value: true });
      }
    });
    return config;
  });
};

const withAndroidTHEOplayer = (config, props) => {
  // Apply Android extensions
  const { extensions } = props | {};
  config = applyAndroidExtensions(config, extensions);

  // Add THEOplayer and local Maven repos to the project's repositories
  return withProjectBuildGradle(config, (config) => {
    const localMaven = 'maven { url("$rootDir/../node_modules/react-native-theoplayer/android/local") }';
    const THEOplayerMaven = 'maven { url("https://maven.theoplayer.com/releases") }';
    config.modResults.contents = config.modResults.contents.replace(/allprojects\s*\{\s*repositories\s*\{/, `$&\n\t\t${localMaven}\n\t\t${THEOplayerMaven}`);
    return config;
  });
};

module.exports = (config, props) => {
  // Apply Android modifications
  return withAndroidTHEOplayer(config, props);
};
