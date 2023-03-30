import type { EventDispatcher, EventMap, StringKeyOf } from './EventDispatcher';
import type { EventListener } from './EventListener';
import { arrayRemoveElement } from '../utils/ArrayUtils';

export class DefaultEventDispatcher<TMap extends EventMap<StringKeyOf<TMap>>> implements EventDispatcher<TMap> {
  readonly _eventListeners: Map<StringKeyOf<TMap>, EventListener<TMap[StringKeyOf<TMap>]>[]> = new Map();

  addEventListener<K extends StringKeyOf<TMap>>(type: K, listener: EventListener<TMap[K]>): void {
    if (!this._eventListeners.has(type)) {
      // @ts-ignore
      this._eventListeners.set(type, [listener]);
    } else {
      // @ts-ignore
      this._eventListeners.get(type)?.push(listener);
    }
  }

  clearEventListeners(): void {
    this._eventListeners.clear();
  }

  dispatchEvent = <K extends StringKeyOf<TMap>>(event: TMap[K]): void => {
    for (const listener of this._eventListeners.get(event.type) ?? []) {
      listener.call(this, event);
    }
  };

  removeEventListener<K extends StringKeyOf<TMap>>(type: K, listener: EventListener<TMap[K]>): void {
    const listeners = this._eventListeners.get(type);
    if (listeners) {
      arrayRemoveElement(listeners, listener);
    }
  }
}
