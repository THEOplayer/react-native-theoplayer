import Ads from './Ads.spec';
import Basic from './Basic.spec';
import Connector from './Connector.spec';
import PresentationMode from './PresentationMode.spec';
import Version from './Version.spec';
import { Platform } from 'react-native';

export default Platform.select({
  ios: [Version, Basic, /*Ads,*/ Connector, PresentationMode],
  default: [Version, Basic, Ads, Connector, PresentationMode],
});
