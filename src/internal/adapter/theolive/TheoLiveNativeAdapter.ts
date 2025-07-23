import type { HespLatencies, TheoLiveAPI, THEOplayerView } from 'react-native-theoplayer';
import { NativeModules, Platform } from 'react-native';

const NativeTheoLiveModule = NativeModules.THEORCTTHEOliveModule;

export class TheoLiveNativeAdapter implements TheoLiveAPI {
  private _token: string | undefined;
  constructor(private _player: THEOplayerView) {}

  get currentLatency(): Promise<number> {
    if (Platform.OS === 'ios') {
      return NativeTheoLiveModule.currentLatency(this._player.nativeHandle);
    }
    // TODO: implement for Android
    return Promise.resolve(-1);
  }

  get latencies(): Promise<HespLatencies> {
    if (Platform.OS === 'ios') {
      return NativeTheoLiveModule.latencies(this._player.nativeHandle);
    }
    // TODO: implement for Android
    return Promise.resolve({
      engineLatency: -1,
      distributionLatency: -1,
      playerLatency: -1,
      theoliveLatency: -1,
    });
  }

  set authToken(token: string) {
    this._token = token;
    NativeTheoLiveModule.setAuthToken(this._player.nativeHandle, token);
  }

  get authToken(): string | undefined {
    return this._token;
  }
}
