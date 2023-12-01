import type { BroadcastAPI } from "react-native-theoplayer";
import type { Event } from '../../api/event/Event';
import type { THEOplayer } from "react-native-theoplayer";

export class ExternalEventAdapter implements BroadcastAPI {
  constructor(private _player: THEOplayer) {
  }

  dispatchEvent(_event: Event): void {
    try {
      // TODO
    } catch (e) {
      console.warn("ExternalEventAPI not available");
    }
  }
}
