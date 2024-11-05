import { SdkVersions } from 'react-native-theoplayer';
import { version as nativeVersionString } from 'theoplayer';
import manifest from '../../manifest.json';

export const sdkVersions = async (): Promise<SdkVersions> => {
  const rnVersionString = manifest.version ?? '';
  return {
    rn: rnVersionString,
    native: nativeVersionString,
  };
};
