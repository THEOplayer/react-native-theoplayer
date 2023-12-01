import type { BroadcastAPI } from "react-native-theoplayer";
import type { THEOplayer } from "react-native-theoplayer";
import type { THEOplayerWebAdapter } from "../THEOplayerWebAdapter";
import type { StringKeyOf } from "../../../api/event/EventDispatcher";
import type { PlayerEventMap } from "react-native-theoplayer";
import type { Event as WebEvent } from 'theoplayer';
import { AdEvent, PlayerEventType } from "react-native-theoplayer";

export interface BroadcastReceiver {
  onReceivedEvent(event: WebEvent): void;
}

export class BroadcastAdapter implements BroadcastAPI {
  private _receivers: BroadcastReceiver[] = [];

  constructor(private _player: THEOplayer) {
  }

  addReceiver(receiver: BroadcastReceiver) {
    this._receivers.push(receiver);
  }

  removeReceiver(receiver: BroadcastReceiver) {
    this._receivers = this._receivers.filter(r => r !== receiver);
  }

  broadcastEvent<K extends StringKeyOf<PlayerEventMap>>(event: PlayerEventMap[K]): void {
    try {
      // Broadcast ReactNative event.
      (this._player as THEOplayerWebAdapter).dispatchEvent(event);

      // Broadcast native event.
      this._receivers.forEach(receiver => {
        const nativeEvent = toNativeEvent(event);
        if (nativeEvent) {
          receiver.onReceivedEvent(nativeEvent);
        }
      })
    } catch (e) {
      console.warn("ExternalEventAPI not available");
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
