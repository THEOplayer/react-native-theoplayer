import type { HespLatencies, TheoLiveAPI, THEOplayerView } from 'react-native-theoplayer';
import { NativeModules } from 'react-native';

const NativeTheoLiveModule = NativeModules.THEORCTTheoLiveModule;

export class TheoLiveNativeAdapter implements TheoLiveAPI {
  constructor(private _player: THEOplayerView) {}

  currentLatency(): Promise<number> {
    return NativeTheoLiveModule.currentLatency(this._player.nativeHandle);
  }

  latencies(): Promise<HespLatencies> {
    return NativeTheoLiveModule.latencies(this._player.nativeHandle);
  }
}
