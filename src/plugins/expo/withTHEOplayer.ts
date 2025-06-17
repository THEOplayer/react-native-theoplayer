import { ConfigPlugin } from '@expo/config-plugins';
import { withTHEOplayerAndroid } from './withTHEOplayerAndroid';

const withTHEOplayerAndroidWrapper: ConfigPlugin = (config, props: any) => {
  // Apply Android modifications
  return withTHEOplayerAndroid(config, props);
};

export default withTHEOplayerAndroidWrapper;
