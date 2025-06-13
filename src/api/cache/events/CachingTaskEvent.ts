import type { Event } from '../../event/Event';

/**
 * The events types dispatched by the {@link CachingTask}.
 *
 * @category Caching
 * @category Events
 * @public
 */
export enum CachingTaskEventType {
  progress = 'progress',
  statechange = 'statechange',
}

/**
 * The events dispatched by the {@link CachingTask}.
 *
 * @category Caching
 * @category Events
 * @public
 */
export interface CachingTaskEventMap {
  /**
   * Dispatched when a segment is added to the cache.
   */
  [CachingTaskEventType.progress]: Event<CachingTaskEventType.progress>;

  /**
   * Dispatched when {@link CachingTask.status} changes.
   */
  [CachingTaskEventType.statechange]: Event<CachingTaskEventType.statechange>;
}

/**
 * Dispatched when the progress of a caching task is updated.
 *
 * @category Caching
 * @category Events
 * @public
 */
export type CachingTaskProgressEvent = Event<CachingTaskEventType.progress>;

/**
 * Dispatched when the status of a caching task is changed.
 *
 * @category Caching
 * @category Events
 * @public
 */
export type CachingTaskStatusChangeEvent = Event<CachingTaskEventType.statechange>;
