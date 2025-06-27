import type { HespLatencies, TheoLiveAPI, THEOplayerView } from 'react-native-theoplayer';
import { NativeModules } from 'react-native';

const NativeTheoLiveModule = NativeModules.THEORCTTHEOliveModule;

export class TheoLiveNativeAdapter implements TheoLiveAPI {
  constructor(private _player: THEOplayerView) {}

  get currentLatency(): Promise<number> {
    return NativeTheoLiveModule.currentLatency(this._player.nativeHandle);
  }

  get latencies(): Promise<HespLatencies> {
    return NativeTheoLiveModule.latencies(this._player.nativeHandle);
  }
}
