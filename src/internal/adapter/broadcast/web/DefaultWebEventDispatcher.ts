import type { EventDispatcher, EventMap, StringKeyOf, EventListener } from 'theoplayer';

export function arrayRemoveElement<T>(array: T[], element: T): boolean {
  const index = array.indexOf(element);
  if (index === -1) {
    return false;
  }
  arrayRemoveAt(array, index);
  return true;
}

export function arrayRemoveAt<T>(array: T[], index: number): void {
  array.splice(index, 1);
}

export class DefaultWebEventDispatcher<TMap extends EventMap<StringKeyOf<TMap>>> implements EventDispatcher<TMap> {
  readonly _eventListeners: Map<StringKeyOf<TMap>, EventListener<TMap[StringKeyOf<TMap>]>[]> = new Map();

  addEventListener<K extends StringKeyOf<TMap>>(types: K | K[], listener: EventListener<TMap[K]>): void {
    if (typeof types === 'string') {
      this.addSingleEventListener_(types, listener);
    } else {
      types.forEach((type) => {
        this.addSingleEventListener_(type, listener);
      });
    }
  }

  private addSingleEventListener_<K extends StringKeyOf<TMap>>(type: K, listener: EventListener<TMap[K]>): void {
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
    const listeners = (this._eventListeners.get(event.type as K) ?? []).slice();
    for (const listener of listeners) {
      listener.call(this, event);
    }
  };

  removeEventListener<K extends StringKeyOf<TMap>>(types: K | K[], listener: EventListener<TMap[K]>): void {
    if (typeof types === 'string') {
      this.removeSingleEventListener(types, listener);
    } else {
      types.forEach((type) => {
        this.removeSingleEventListener(type, listener);
      });
    }
  }

  removeSingleEventListener<K extends StringKeyOf<TMap>>(type: K, listener: EventListener<TMap[K]>): void {
    const listeners = this._eventListeners.get(type);
    if (listeners) {
      arrayRemoveElement(listeners, listener);
    }
  }
}
