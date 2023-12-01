import type { ExternalEventAPI } from "react-native-theoplayer";
import type { Event } from '../../api/event/Event';
import type { THEOplayer } from "react-native-theoplayer";

export class ExternalEventAdapter implements ExternalEventAPI {
  constructor(private _player: THEOplayer) {
  }

  dispatchEvent(event: Event): void {
    try {
      // TODO
    } catch (e) {
      console.warn("ExternalEventAPI not available");
    }
  }
}
