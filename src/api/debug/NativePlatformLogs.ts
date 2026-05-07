import { NativeModules } from 'react-native';

type NativePlayerModuleType = {
  setNativePlatformLogsEnabled?: (enabled: boolean) => Promise<void>;
};

const NativePlayerModule = NativeModules.THEORCTPlayerModule as NativePlayerModuleType;

export function setNativePlatformLogsEnabled(enabled: boolean): Promise<void> {
  if (!NativePlayerModule?.setNativePlatformLogsEnabled) {
    return Promise.resolve();
  }
  return NativePlayerModule.setNativePlatformLogsEnabled(enabled);
}
