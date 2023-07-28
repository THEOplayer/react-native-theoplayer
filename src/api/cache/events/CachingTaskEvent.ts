import type { Event } from '../../event/Event';

export enum CachingTaskEventType {
  progress = 'progress',
  statechange = 'statechange',
}

/**
 * The events dispatched by the {@link CachingTask}.
 *
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

export interface CachingTaskProgressEvent extends Event<CachingTaskEventType.progress> {
  // Identifier of the task.
  readonly id: string;
}

export interface CachingTaskStatusChangeEvent extends Event<CachingTaskEventType.statechange> {
  // Identifier of the task.
  readonly id: string;
}
