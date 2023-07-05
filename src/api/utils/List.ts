/**
 * List of generic items.
 *
 * @public
 */
import type { EventDispatcher, EventMap, StringKeyOf } from '../event/EventDispatcher';

export interface List<T> extends Array<T> {
  /**
   * The number of items in the list.
   */
  length: number;

  /**
   * Returns the object representing the nth item in the list.
   * @param index - The index of the item to retrieve.
   */
  item(index: number): T | undefined;

  /**
   * The object representing the nth in the list.
   */
  [index: number]: T;
}

/**
 * List of generic items which can dispatch events.
 *
 * @public
 */
export interface EventedList<T, M extends EventMap<StringKeyOf<M>>> extends List<T>, EventDispatcher<M> {}
