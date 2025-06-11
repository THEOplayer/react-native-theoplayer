import { ConfigPlugin } from '@expo/config-plugins';
import { withAndroidTHEOplayer } from './withTHEOplayerAndroid';

const withTHEOplayerAndroidWrapper: ConfigPlugin = (config, props: any) => {
  // Apply Android modifications
  return withAndroidTHEOplayer(config, props);
};

export default withTHEOplayerAndroidWrapper;
