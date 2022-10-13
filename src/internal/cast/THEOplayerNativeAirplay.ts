import type { Airplay, CastState, THEOplayerView } from 'react-native-theoplayer';
import { NativeModules } from 'react-native';

export class THEOplayerNativeAirplay implements Airplay {
  public constructor(private readonly _player: THEOplayerView) {}

  casting(): Promise<boolean> {
    return NativeModules.CastModule.airplayCasting(this._player.nativeHandle);
  }

  state(): Promise<CastState> {
    return NativeModules.CastModule.airplayState(this._player.nativeHandle);
  }

  start(): void {
    NativeModules.CastModule.airplayStart(this._player.nativeHandle);
  }

  stop(): void {
    NativeModules.CastModule.airplayStop(this._player.nativeHandle);
  }
}
