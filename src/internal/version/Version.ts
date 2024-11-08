import type { SdkVersions } from 'react-native-theoplayer';
import * as manifest from '../../manifest.json';
import { getNativeModule } from '../utils/ModuleUtils';

export const sdkVersions = async (): Promise<SdkVersions> => {
  const rnVersionString = manifest.version ?? '';
  const nativeVersionString = await getNativeModule('Player').version();
  return {
    rn: rnVersionString,
    native: nativeVersionString,
  };
};
