import type { HespLatencies, TheoLiveAPI, THEOplayerView } from 'react-native-theoplayer';
import { NativeModules } from 'react-native';

const NativeTheoLiveModule = NativeModules.THEORCTTHEOliveModule;

export class TheoLiveNativeAdapter implements TheoLiveAPI {
  private _token: string | undefined;
  constructor(private _player: THEOplayerView) {}

  get currentLatency(): Promise<number> {
    return NativeTheoLiveModule.currentLatency(this._player.nativeHandle);
  }

  get latencies(): Promise<HespLatencies> {
    return NativeTheoLiveModule.latencies(this._player.nativeHandle);
  }

  set authToken(token: string) {
    this._token = token;
    NativeTheoLiveModule.setAuthToken(this._player.nativeHandle, token);
  }

  get authToken(): string | undefined {
    return this._token;
  }
}
