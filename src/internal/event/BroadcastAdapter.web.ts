import type { BroadcastAPI } from "react-native-theoplayer";
import type { THEOplayer } from "react-native-theoplayer";
import type { THEOplayerWebAdapter } from "../adapter/THEOplayerWebAdapter";
import type { StringKeyOf } from "../../api/event/EventDispatcher";
import type { PlayerEventMap } from "react-native-theoplayer";

export class BroadcastAdapter implements BroadcastAPI {
  constructor(private _player: THEOplayer) {
  }

  broadcastEvent<K extends StringKeyOf<PlayerEventMap>>(event: PlayerEventMap[K]): void {
    try {
      // Broadcast ReactNative event.
      (this._player as THEOplayerWebAdapter).dispatchEvent(event);

      // TODO: Broadcast native event.
    } catch (e) {
      console.warn("ExternalEventAPI not available");
    }
  }
}
