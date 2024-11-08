/* eslint-disable @typescript-eslint/no-require-imports */
import { NativeModules, Platform } from 'react-native';

const LINKING_ERROR =
  `The package 'react-native-newarch-module_test' doesn't seem to be linked. Make sure: \n\n` +
  Platform.select({ ios: "- You have run 'pod install'\n", default: '' }) +
  '- You rebuilt the app after installing the package\n' +
  '- You are not using Expo Go\n';

// @ts-expect-error
const isTurboModuleEnabled = global.__turboModuleProxy != null;

import { default as NativeAdsModule } from '../../specs/NativeAdsModule';
import { default as NativeCacheModule } from '../../specs/NativeCacheModule';
import { default as NativeCastModule } from '../../specs/NativeCastModule';
import { default as NativeContentProtectionModule } from '../../specs/NativeContentProtectionModule';
import { default as NativeEventBroadcastModule } from '../../specs/NativeEventBroadcastModule';
import { default as NativePlaybackSettingsModule } from '../../specs/NativePlaybackSettingsModule';
import { default as NativePlayerModule } from '../../specs/NativePlayerModule';

export function getNativeModule(name: string): any {
  let turboModule;
  switch (name) {
    case 'Ads':
      turboModule = NativeAdsModule;
      break;
    case 'Cache':
      turboModule = NativeCacheModule;
      break;
    case 'Cast':
      turboModule = NativeCastModule;
      break;
    case 'ContentProtection':
      turboModule = NativeContentProtectionModule;
      break;
    case 'EventBroadcast':
      turboModule = NativeEventBroadcastModule;
      break;
    case 'PlaybackSettings':
      turboModule = NativePlaybackSettingsModule;
      break;
    case 'Player':
      turboModule = NativePlayerModule;
      break;
    default:
      throw new Error(`Unknown module '${name}'`);
  }
  const NativeModule = isTurboModuleEnabled ? turboModule : NativeModules[`THEORCT${name}Module`];

  return NativeModule
    ? NativeModule
    : new Proxy(
        {},
        {
          get() {
            throw new Error(LINKING_ERROR);
          },
        },
      );
}
