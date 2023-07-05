import type { AddCachingTaskEvent } from './AddCachingTaskEvent';
import type { RemoveCachingTaskEvent } from './RemoveCachingTaskEvent';

export enum CachingTaskListEventType {
  addtask = 'addtask',
  removetask = 'removetask',
}

/**
 * The events dispatched by the {@link CachingTaskList}.
 *
 * @public
 */
export interface CachingTaskListEventMap {
  /**
   * {@inheritDoc AddCachingTaskEvent}
   */
  [CachingTaskListEventType.addtask]: AddCachingTaskEvent;

  /**
   * {@inheritDoc AddCachingTaskEvent}
   */
  [CachingTaskListEventType.removetask]: RemoveCachingTaskEvent;
}
