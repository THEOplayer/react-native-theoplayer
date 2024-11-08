import type { EventBroadcastAPI, PlayerEventMap, THEOplayer, StringKeyOf } from 'react-native-theoplayer';
import type { THEOplayerAdapter } from '../THEOplayerAdapter';
import { getNativeModule } from '../../utils/ModuleUtils';

const NativeEventBroadcastModule = getNativeModule('EventBroadcast');

export class EventBroadcastAdapter implements EventBroadcastAPI {
  constructor(private _player: THEOplayer) {}

  broadcastEvent<K extends StringKeyOf<PlayerEventMap>>(event: PlayerEventMap[K]): void {
    // Broadcast ReactNative event.
    (this._player as THEOplayerAdapter).dispatchEvent(event);

    try {
      // Broadcast native event.
      NativeEventBroadcastModule.broadcastEvent(this._player.nativeHandle, Object.freeze(event));
    } catch (e) {
      console.warn(`EventBroadcastModule not available: ${e}`);
    }
  }
}
