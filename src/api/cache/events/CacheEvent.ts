import type { Event } from '../../event/Event';
import type { CacheStatus } from '../MediaCacheAPI';
import type { CachingTask } from '../CachingTask';

/**
 * The event types dispatched by the {@link MediaCacheAPI | cache API}.
 *
 * @category Caching
 * @category Events
 * @public
 */
export enum CacheEventType {
  statechange = 'statechange',
  addtask = 'addtask',
  removetask = 'removetask',
}

/**
 * The events dispatched by the {@link MediaCacheAPI | cache API}.
 *
 * @category Caching
 * @category Events
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

/**
 * CacheStatusChangeEvent is dispatched when the status of a caching task is updated.
 *
 * @category Caching
 * @public
 */
export interface CacheStatusChangeEvent extends Event<CacheEventType.statechange> {
  /**
   * The cache's new status.
   */
  readonly status: CacheStatus;
}

/**
 * AddCachingTaskEvent is dispatched when a caching task is added.
 *
 * @category Caching
 * @public
 */
export interface AddCachingTaskEvent extends Event<CacheEventType.addtask> {
  /**
   * The task which has been added.
   */
  readonly task: CachingTask;
}

/**
 * RemoveCachingTaskEvent is dispatched when a caching task is removed.
 *
 * @category Caching
 * @public
 */
export interface RemoveCachingTaskEvent extends Event<CacheEventType.removetask> {
  /**
   * The task which has been removed.
   */
  readonly task: CachingTask;
}
