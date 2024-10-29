import { SdkVersions } from '../../api/version/SdkVersions';
import { version as nativeVersion } from 'theoplayer';
import * as pkg from '../../../package.json';

export const sdkVersions = async (): Promise<SdkVersions> => {
  return {
    rn: pkg.version,
    native: nativeVersion,
  };
};
