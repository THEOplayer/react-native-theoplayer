import { NativeModules } from 'react-native';
import type { SdkVersions } from 'react-native-theoplayer';
import * as manifest from '../../manifest.json';

export const sdkVersions = async (): Promise<SdkVersions> => {
  const rnVersionString = manifest.version ?? '';
  const nativeVersionString = await NativeModules.THEORCTPlayerModule.version();
  return {
    rn: rnVersionString,
    native: nativeVersionString,
  };
};
