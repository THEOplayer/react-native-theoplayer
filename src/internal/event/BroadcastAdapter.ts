import type { BroadcastAPI } from "react-native-theoplayer";
import type { Event } from '../../api/event/Event';
import { NativeModules } from "react-native";
import * as console from "console";
import type { THEOplayerAdapter } from "../adapter/THEOplayerAdapter";

export class EventBroadcastAdapter implements BroadcastAPI {
  constructor(private _player: THEOplayerAdapter) {
  }

  broadcastEvent(event: Event): void {
    try {
      // Broadcast ReactNative event.
      this._player.dispatchEvent(event);

      // Broadcast native event.
      NativeModules.ExternalEventRouterModule.dispatchEvent(this._player.nativeHandle, event)
    } catch (e) {
      console.warn("ExternalEventAPI not available");
    }
  }
}
