import type { GoogleDAI } from "react-native-theoplayer";
import { NativeModules } from "react-native";
import type { THEOplayerView } from "react-native-theoplayer";

export class THEOplayerNativeGoogleDAI implements GoogleDAI {

  public constructor(private readonly _player: THEOplayerView) {
  }

  get snapback(): Promise<boolean> {
    return NativeModules.AdsModule.daiSnapback(this._player.nativeHandle);
  }

  contentTimeForStreamTime(time: number): Promise<number> {
    return NativeModules.AdsModule.daiContentTimeForStreamTime(this._player.nativeHandle, time);
  }

  streamTimeForContentTime(time: number): Promise<number> {
    return NativeModules.AdsModule.daiStreamTimeForContentTime(this._player.nativeHandle, time);
  }
}
