import type { Event } from './Event';
import type { EventListener } from './EventListener';

/**
 * A record used to map events.
 * Each entry contains an event name with associated event interface.
 *
 * @example
 * ```
 * {
 *   'statechange': StateChangeEvent,
 *   'error': ErrorEvent
 * }
 * ```
 *
 * @public
 */
export type EventMap<TType extends string> = Record<TType, Event<TType>>;

/**
 * Helper type to extract string keys from type objects.
 *
 * @public
 */
export type StringKeyOf<T> = Extract<keyof T, string>;

/**
 * Dispatches events that are fired.
 *
 * @public
 */
export interface EventDispatcher<TEventMap extends EventMap<StringKeyOf<TEventMap>>> {
  /**
   * Add the given listener for the given event type(s).
   *
   * @param type - The type of the event.
   * @param listener - The callback which is executed when the event occurs.
   */
  addEventListener<TType extends StringKeyOf<TEventMap>>(type: TType | readonly TType[], listener: EventListener<TEventMap[TType]>): void;

  /**
   * Remove the given listener for the given event type(s).
   *
   * @param type - The type of the event.
   * @param listener - The callback which will be removed.
   */
  removeEventListener<TType extends StringKeyOf<TEventMap>>(type: TType | readonly TType[], listener: EventListener<TEventMap[TType]>): void;
}
