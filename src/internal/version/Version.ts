import { NativeModules } from 'react-native';
import { SdkVersions } from '../../api/version/SdkVersions';
import * as pkg from '../../../package.json';

const nativePlayerModule = NativeModules.THEORCTPlayerModule;

export const sdkVersions: SdkVersions = {
  rn: pkg.version,
  native: nativePlayerModule.version,
};
