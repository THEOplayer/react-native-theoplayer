/**
 * List of caching tasks.
 *
 * @public
 */
import type { CachingTask } from './CachingTask';
import type { CachingTaskListEventMap } from './events/CachingTaskListEvent';
import type { EventedList } from '../utils/List';

export type CachingTaskList = EventedList<CachingTask, CachingTaskListEventMap>;
