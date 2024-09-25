import { NativeModules, Platform } from 'react-native';
import { PlaybackSettingsAPI } from '../../api/playback/PlaybackSettingsAPI';

const NativePlaybackSettingsModule = NativeModules.THEORCTPlaybackSettingsModule;

const TAG = 'PlaybackSettings';

export class NativePlaybackSettings implements PlaybackSettingsAPI {
  useFastStartup(useFastStartup: boolean): void {
    if (Platform.OS !== 'android') {
      console.warn(TAG, 'useFastStartup is only available on Android platforms.');
      return;
    }
    NativePlaybackSettingsModule.useFastStartup(useFastStartup);
  }
  setLipSyncCorrection(correctionMs: number): void {
    if (Platform.OS !== 'android') {
      console.warn(TAG, 'setLipSyncCorrect is only available on Android platforms.');
      return;
    }
    NativePlaybackSettingsModule.setLipSyncCorrection(correctionMs);
  }
}

export const PlaybackSettings: PlaybackSettingsAPI = new NativePlaybackSettings();
