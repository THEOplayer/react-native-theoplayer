import { PlaybackSettingsAPI } from 'react-native-theoplayer';

const TAG = 'PlaybackSettings';
export class NativePlaybackSettings implements PlaybackSettingsAPI {
  useFastStartup(_: boolean): void {
    console.warn(TAG, 'useFastStartup is not available on Web platforms.');
  }

  setLipSyncCorrection(_: number): void {
    console.warn(TAG, 'setLipSyncCorrect is not available on Web platforms.');
  }
}
export const PlaybackSettings: PlaybackSettingsAPI = new NativePlaybackSettings();
