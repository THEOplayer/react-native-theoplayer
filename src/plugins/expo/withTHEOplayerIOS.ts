import { ConfigPlugin } from '@expo/config-plugins';
import { Extension, THEOplayerPluginProps } from './Common';
import { withCustomPod } from './withCustomPod';

const CAST_POD_LINE = `  pod 'react-native-google-cast', :git => 'https://github.com/Danesz/react-native-google-cast.git', branch: 'feature/guestmode_apple_silicon'`;

function mapIOSExtensionKey(ext: Extension): string | undefined {
  switch (ext) {
    case 'ima':
      return 'GOOGLE_IMA';
    case 'cast':
      return 'CHROMECAST';
    case 'theoads':
      return 'THEO_ADS';
    case 'millicast':
      return 'MILLICAST';
    case 'sideloaded-texttracks':
      return 'SIDELOADED_TEXTTRACKS';
    default:
      return undefined;
  }
}

const applyIOSExtensions: ConfigPlugin<THEOplayerPluginProps['extensions']> = (config, extensions) => {
  const iosFeatures = extensions?.map(mapIOSExtensionKey)?.filter((f): f is string => !!f);

  if (iosFeatures?.length ?? 0 > 0) {
    const featureList = iosFeatures?.join(',');
    console.log(`Setting THEO_FEATURES="${featureList}"`);
    process.env.THEO_FEATURES = featureList;
  }

  // Align react-native-google-cast dependency
  if (extensions?.includes('cast')) {
    config = withCustomPod(config, CAST_POD_LINE);
  }

  return config;
};

export const withTHEOplayerIOS: ConfigPlugin<THEOplayerPluginProps> = (config, props = {}) => {
  const { extensions, ios } = props;
  return applyIOSExtensions(config, ios?.extensions ?? extensions);
};
