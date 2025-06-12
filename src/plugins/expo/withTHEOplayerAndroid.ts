import { ConfigPlugin, withProjectBuildGradle, withGradleProperties } from '@expo/config-plugins';
import { PropertiesItem } from '@expo/config-plugins/build/android/Properties';

type Extension = 'ima' | 'dai' | 'cast' | 'theoads' | 'millicast';

interface THEOplayerPluginProps {
  extensions?: Extension[];
}

function mapAndroidExtensionKey(ext: Extension): string | undefined {
  switch (ext) {
    case 'ima':
      return 'THEOplayer_extensionGoogleIMA';
    case 'dai':
      return 'THEOplayer_extensionGoogleDAI';
    case 'cast':
      return 'THEOplayer_extensionCast';
    case 'theoads':
      return 'THEOplayer_extensionTHEOads';
    case 'millicast':
      return 'THEOplayer_extensionMillicast';
    default:
      return undefined;
  }
}

const applyAndroidExtensions: ConfigPlugin<THEOplayerPluginProps['extensions']> = (config, extensions) => {
  return withGradleProperties(config, (config) => {
    extensions?.forEach((ext) => {
      const key = mapAndroidExtensionKey(ext);
      if (key) {
        const prop: PropertiesItem = { type: 'property', key, value: 'true' };
        config.modResults.push(prop);
      }
    });
    return config;
  });
};

export const withAndroidTHEOplayer: ConfigPlugin<THEOplayerPluginProps> = (config, props = {}) => {
  const { extensions } = props;

  // Apply Android extensions
  config = applyAndroidExtensions(config, extensions);

  // Add THEOplayer and local Maven repos to the project's repositories
  return withProjectBuildGradle(config, (config) => {
    const localMaven = 'maven { url("$rootDir/../node_modules/react-native-theoplayer/android/local") }';
    const THEOplayerMaven = 'maven { url("https://maven.theoplayer.com/releases") }';

    config.modResults.contents = config.modResults.contents.replace(
      /allprojects\s*\{\s*repositories\s*\{/,
      `$&\n\t\t${localMaven}\n\t\t${THEOplayerMaven}`,
    );

    return config;
  });
};
