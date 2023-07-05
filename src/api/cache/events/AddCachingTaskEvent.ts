import type { Event } from '../../event/Event';
import type { CachingTaskListEventType } from './CachingTaskListEvent';
import type { CachingTask } from '../CachingTask';

/**
 * Dispatched when a caching task is added.
 *
 * @public
 */
export interface AddCachingTaskEvent extends Event<CachingTaskListEventType.addtask> {
  /**
   * The task which has been added.
   */
  readonly task: CachingTask;
}
