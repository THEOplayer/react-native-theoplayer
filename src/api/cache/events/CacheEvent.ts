import type { Event } from '../../event/Event';

export enum CacheEventType {
  statechange = 'statechange',
}

/**
 * The events dispatched by the {@link Cache | cache API}.
 *
 * @public
 */
export interface CacheEventMap {
  /**
   * Dispatched when {@link Cache.status} changes.
   */
  [CacheEventType.statechange]: Event<CacheEventType.statechange>;
}
