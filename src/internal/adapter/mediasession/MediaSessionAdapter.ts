import type { MediaSessionAPI } from "react-native-theoplayer";
import { NativeModules } from "react-native";
import type { THEOplayerView } from "react-native-theoplayer";

export class MediaSessionAdapter implements MediaSessionAPI {
  public constructor(private _player: THEOplayerView) {
  }

  setActive(active: boolean): void {
    NativeModules.MediaSessionModule.setActive(this._player.nativeHandle, active);
  }
}
