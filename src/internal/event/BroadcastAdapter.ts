import type { BroadcastAPI, PlayerEventMap, THEOplayer } from "react-native-theoplayer";
import { NativeModules } from "react-native";
import * as console from "console";
import type { THEOplayerAdapter } from "../adapter/THEOplayerAdapter";
import type { StringKeyOf } from "../../api/event/EventDispatcher";

export class BroadcastAdapter implements BroadcastAPI {
  constructor(private _player: THEOplayer) {
  }

  broadcastEvent<K extends StringKeyOf<PlayerEventMap>>(event: PlayerEventMap[K]): void {
    try {
      // Broadcast ReactNative event.
      (this._player as THEOplayerAdapter).dispatchEvent(event);

      // Broadcast native event.
      NativeModules.ExternalEventRouterModule.dispatchEvent(this._player.nativeHandle, event)
    } catch (e) {
      console.warn("ExternalEventAPI not available");
    }
  }
}
