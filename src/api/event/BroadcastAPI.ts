import type { Event } from './Event';

/**
 * The BroadcastAPI allows dispatching extra player events to both ReactNative and native listeners.
 *
 * @internal
 */
export interface BroadcastAPI {
  /**
   * Broadcast an event.
   */
  broadcastEvent(event: Event) : void;
}
