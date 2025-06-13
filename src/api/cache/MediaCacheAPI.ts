import type { EventDispatcher } from '../event/EventDispatcher';
import type { SourceDescription } from 'react-native-theoplayer';
import type { CachingTaskParameters } from './CachingTaskParameters';
import type { CachingTask } from './CachingTask';
import type { CacheEventMap } from './events/CacheEvent';
import type { CachingTaskList } from './CachingTaskList';

/**
 * The cache status, represented by a value from the following list:
 * <br/> - `'uninitialised'`: Previously stored caching tasks are unavailable.
 * <br/> - `'initialised'`: Previously stored caching tasks are now available.
 *
 * @category Caching
 * @public
 */
export enum CacheStatus {
  uninitialised = 'uninitialised',
  initialised = 'initialised',
}

/**
 * The media cache API.
 *
 * @category Caching
 * @public
 */
export interface MediaCacheAPI extends EventDispatcher<CacheEventMap> {
  /**
   * List of caching tasks which control the caching of media.
   */
  readonly tasks: CachingTaskList;

  /**
   * The current status of the cache.
   */
  readonly status: CacheStatus;

  /**
   * Create a caching task which controls the caching of media.
   *
   * @param source - Describes the media source to be cached.
   * @param parameters - Contains caching task related options.
   */
  createTask(source: SourceDescription, parameters: CachingTaskParameters): Promise<CachingTask>;
}
