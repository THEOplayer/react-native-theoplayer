import { NativeModules } from 'react-native';
import { SdkVersions } from '../../api/version/SdkVersions';
import * as pkg from '../../../package.json';

export const sdkVersions = async (): Promise<SdkVersions> => {
  const versionString = await NativeModules.THEORCTPlayerModule.version();
  return {
    rn: pkg.version,
    native: versionString,
  };
};
