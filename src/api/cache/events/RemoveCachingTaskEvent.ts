import type { Event } from '../../event/Event';
import type { CachingTaskListEventType } from './CachingTaskListEvent';
import type { CachingTask } from '../CachingTask';

/**
 * Dispatched when a caching task is removed.
 *
 * @public
 */
export interface RemoveCachingTaskEvent extends Event<CachingTaskListEventType.removetask> {
  /**
   * The task which has been removed.
   */
  readonly task: CachingTask;
}
