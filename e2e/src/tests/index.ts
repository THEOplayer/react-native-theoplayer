import Ads from './Ads.spec';
import Basic from './Basic.spec';
// import Connector from './Connector.spec';
import PresentationMode from './PresentationMode.spec';
import Version from './Version.spec';
import { Platform } from 'react-native';

const testSet = [Version, Basic, Ads, PresentationMode /*, Connector*/, Version, Basic, Ads, PresentationMode /*, Connector*/];
export default Platform.select({
  ios: testSet,
  default: testSet,
});
