import type { EventBroadcastAPI, PlayerEventMap, THEOplayer } from 'react-native-theoplayer';
import { NativeModules } from 'react-native';
import type { THEOplayerAdapter } from '../THEOplayerAdapter';
import type { StringKeyOf } from '../../../api/event/EventDispatcher';

export class EventBroadcastAdapter implements EventBroadcastAPI {
  constructor(private _player: THEOplayer) {}

  broadcastEvent<K extends StringKeyOf<PlayerEventMap>>(event: PlayerEventMap[K]): void {
    // Broadcast ReactNative event.
    (this._player as THEOplayerAdapter).dispatchEvent(event);

    try {
      // Broadcast native event.
      NativeModules.EventBroadcastModule.broadcastEvent(this._player.nativeHandle, Object.freeze(event));
    } catch (e) {
      console.warn(`EventBroadcastModule not available: ${e}`);
    }
  }
}
