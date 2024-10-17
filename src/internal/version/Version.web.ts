import { SdkVersions } from '../../api/version/SdkVersions';
import { version as nativeVersion } from 'theoplayer';
import * as pkg from '../../../package.json';

export const sdkVersions: SdkVersions = {
  rn: pkg.version,
  native: nativeVersion,
};
