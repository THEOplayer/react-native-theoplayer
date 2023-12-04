import type { EventBroadcastAPI } from "react-native-theoplayer";
import type { THEOplayer } from "react-native-theoplayer";
import type { THEOplayerWebAdapter } from "../THEOplayerWebAdapter";
import type { StringKeyOf } from "../../../api/event/EventDispatcher";
import type { PlayerEventMap } from "react-native-theoplayer";
import type { Event as WebEvent, EventMap } from 'theoplayer';
import { AdEvent, PlayerEventType } from "react-native-theoplayer";
import { DefaultWebEventDispatcher } from "./web/DefaultWebEventDispatcher";

export class EventBroadcastAdapter extends DefaultWebEventDispatcher<EventMap<string>> implements EventBroadcastAPI {

  constructor(private _player: THEOplayer) {
    super();
  }

  broadcastEvent<K extends StringKeyOf<PlayerEventMap>>(event: PlayerEventMap[K]): void {
    // Broadcast ReactNative event.
    (this._player as THEOplayerWebAdapter).dispatchEvent(event);

    // Broadcast native event.
    const nativeEvent = toNativeEvent(event);
    if (nativeEvent) {
      this.dispatchEvent(nativeEvent);
    }
  }
}

function toNativeEvent<K extends StringKeyOf<PlayerEventMap>>(event: PlayerEventMap[K]): WebEvent | undefined {
  switch (event.type) {
    case PlayerEventType.AD_EVENT: return toNativeAdEvent(event);
    default: return undefined
  }
}

function toNativeAdEvent(event: AdEvent): WebEvent | undefined {
  return {
    type: event.subType,
    ad: event.ad,
    date: event.date
  } as WebEvent;
}
