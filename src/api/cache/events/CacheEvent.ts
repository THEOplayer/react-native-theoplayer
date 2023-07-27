import type { Event } from '../../event/Event';
import type { AddCachingTaskEvent } from './AddCachingTaskEvent';
import type { RemoveCachingTaskEvent } from './RemoveCachingTaskEvent';
import { CachingTaskListEventType } from './CachingTaskListEvent';

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

  /**
   * {@inheritDoc AddCachingTaskEvent}
   */
  [CachingTaskListEventType.addtask]: AddCachingTaskEvent;

  /**
   * {@inheritDoc AddCachingTaskEvent}
   */
  [CachingTaskListEventType.removetask]: RemoveCachingTaskEvent;
}
