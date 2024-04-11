import type { Event } from '../../event/Event';
import type { CacheStatus } from '../MediaCacheAPI';
import type { CachingTask } from '../CachingTask';

export enum CacheEventType {
  statechange = 'statechange',
  addtask = 'addtask',
  removetask = 'removetask',
}

/**
 * The events dispatched by the {@link MediaCacheAPI | cache API}.
 *
 * @public
 */
export interface CacheEventMap {
  /**
   * Dispatched when {@link MediaCacheAPI.status} changes.
   */
  [CacheEventType.statechange]: Event<CacheEventType.statechange>;

  /**
   * {@inheritDoc AddCachingTaskEvent}
   */
  [CacheEventType.addtask]: AddCachingTaskEvent;

  /**
   * {@inheritDoc AddCachingTaskEvent}
   */
  [CacheEventType.removetask]: RemoveCachingTaskEvent;
}

export interface CacheStatusChangeEvent extends Event<CacheEventType.statechange> {
  /**
   * The cache's new status.
   */
  readonly status: CacheStatus;
}

/**
 * Dispatched when a caching task is added.
 *
 * @public
 */
export interface AddCachingTaskEvent extends Event<CacheEventType.addtask> {
  /**
   * The task which has been added.
   */
  readonly task: CachingTask;
}

/**
 * Dispatched when a caching task is removed.
 *
 * @public
 */
export interface RemoveCachingTaskEvent extends Event<CacheEventType.removetask> {
  /**
   * The task which has been removed.
   */
  readonly task: CachingTask;
}
