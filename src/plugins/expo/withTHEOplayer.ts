import { ConfigPlugin } from '@expo/config-plugins';
import { withTHEOplayerAndroid } from './withTHEOplayerAndroid';
import { withTHEOplayerIOS } from './withTHEOplayerIOS';

const withTHEOplayerWrapper: ConfigPlugin = (config, props: any) => {
  config = withTHEOplayerAndroid(config, props);
  config = withTHEOplayerIOS(config, props);
  return config;
};

export default withTHEOplayerWrapper;
