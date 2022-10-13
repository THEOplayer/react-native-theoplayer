import type { CastState, Chromecast, THEOplayerView } from 'react-native-theoplayer';
import { NativeModules } from 'react-native';

export class THEOplayerNativeChromecast implements Chromecast {
  public constructor(private readonly _player: THEOplayerView) {}

  casting(): Promise<boolean> {
    return NativeModules.CastModule.chromecastCasting(this._player.nativeHandle);
  }

  state(): Promise<CastState> {
    return NativeModules.CastModule.chromecastState(this._player.nativeHandle);
  }

  start(): void {
    NativeModules.CastModule.chromecastStart(this._player.nativeHandle);
  }

  stop(): void {
    NativeModules.CastModule.chromecastStop(this._player.nativeHandle);
  }

  join(): void {
    NativeModules.CastModule.chromecastJoin(this._player.nativeHandle);
  }

  leave(): void {
    NativeModules.CastModule.chromecastLeave(this._player.nativeHandle);
  }
}
