import type { EventDispatcher, EventMap, StringKeyOf } from 'react-native-theoplayer';
import type { EventListener } from 'react-native-theoplayer';
import { arrayRemoveElement } from '../../utils/arrayUtil';

export class DefaultEventDispatcher<TMap extends EventMap<StringKeyOf<TMap>>> implements EventDispatcher<TMap> {
  readonly _eventListeners: Map<StringKeyOf<TMap>, EventListener<TMap[StringKeyOf<TMap>]>[]> = new Map();

  addEventListener<K extends StringKeyOf<TMap>>(type: K | readonly K[], listener: EventListener<TMap[K]>): void {
    if (typeof listener !== 'function') {
      return;
    } else if (Array.isArray(type)) {
      type.forEach((t) => this.addSingleEventListener(t, listener));
    } else {
      this.addSingleEventListener(type as K, listener);
    }
  }

  private addSingleEventListener<K extends StringKeyOf<TMap>>(type: K, listener: EventListener<TMap[K]>): void {
    if (!this._eventListeners.has(type)) {
      this._eventListeners.set(type, [listener as EventListener<TMap[StringKeyOf<TMap>]>]);
    } else {
      this._eventListeners.get(type)?.push(listener as EventListener<TMap[StringKeyOf<TMap>]>);
    }
  }

  clearEventListeners(): void {
    this._eventListeners.clear();
  }

  dispatchEvent = <K extends StringKeyOf<TMap>>(event: TMap[K]): void => {
    const listeners = (this._eventListeners.get(event.type) ?? []).slice();
    for (const listener of listeners) {
      listener.call(this, event);
    }
  };

  removeEventListener<K extends StringKeyOf<TMap>>(type: K | readonly K[], listener: EventListener<TMap[K]>): void {
    if (typeof listener !== 'function') {
      return;
    } else if (Array.isArray(type)) {
      type.forEach((t) => this.removeSingleEventListener(t, listener));
    } else {
      this.removeSingleEventListener(type as K, listener);
    }
  }

  private removeSingleEventListener<K extends StringKeyOf<TMap>>(type: K, listener: EventListener<TMap[K]>): void {
    const listeners = this._eventListeners.get(type);
    if (listeners) {
      arrayRemoveElement(listeners, listener);
    }
  }
}
