import { NativeModules } from 'react-native';
import type { SdkVersions } from 'react-native-theoplayer';
import * as manifest from '../../manifest.json';

export const sdkVersions = async (): Promise<SdkVersions> => {
  const rnVersionString = manifest.version ?? 'NA';
  let nativeVersionString;
  try {
    nativeVersionString = await NativeModules.THEORCTPlayerModule.version();
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (_e) {
    nativeVersionString = 'NA';
  }
  return {
    rn: rnVersionString,
    native: nativeVersionString,
  };
};
