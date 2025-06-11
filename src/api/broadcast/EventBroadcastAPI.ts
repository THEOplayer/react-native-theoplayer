import type { Event } from '../event/Event';

/**
 * The EventBroadcastAPI allows dispatching extra player events to both ReactNative and native listeners.
 *
 * @category Events
 * @internal
 */
export interface EventBroadcastAPI {
  /**
   * Broadcast an event.
   */
  broadcastEvent(event: Event) : void;
}
