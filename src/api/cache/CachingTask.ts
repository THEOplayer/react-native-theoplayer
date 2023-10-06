import type { SourceDescription } from 'react-native-theoplayer';
import type { EventDispatcher } from '../event/EventDispatcher';
import type { CachingTaskLicense } from './CachingTaskLicense';
import type { CachingTaskParameters } from './CachingTaskParameters';
import type { CachingTaskEventMap } from './events/CachingTaskEvent';
import type { TimeRange } from '../timeranges/TimeRange';
/**
 * The cache task status, represented by a value from the following list:
 * <br/> - `'idle'`: The task has been created, but has not started downloading content.
 * <br/> - `'loading'`: The task is currently downloading the content.
 * <br/> - `'done'`: The task has finished downloading all content.
 * <br/> - `'error'`: The task has encountered an error while downloading or evicting content.
 * <br/> - `'evicted'`: All data associated with the task has been removed because the task expired or the user invoked the {@link CachingTask.remove|remove} method.
 *
 * @public
 */
export enum CacheTaskStatus {
  idle = 'idle',
  loading = 'loading',
  done = 'done',
  error = 'error',
  evicted = 'evicted',
}

/**
 * Represents a caching task.
 *
 * @public
 */
export interface CachingTask extends EventDispatcher<CachingTaskEventMap> {
  /**
   * The generated identifier for the task.
   */
  readonly id: string;

  /**
   * The current status of the task.
   */
  readonly status: CacheTaskStatus;

  /**
   * The media source associated with the task.
   */
  readonly source: SourceDescription;

  /**
   * The configuration of the task.
   */
  readonly parameters: CachingTaskParameters;

  /**
   * The requested cached duration of the media, in seconds.
   */
  readonly duration: number;

  /**
   * The time ranges cached, in milliseconds.
   */
  readonly cached: TimeRange[];

  /**
   * The duration cached, in seconds.
   */
  readonly secondsCached: number;

  /**
   * The percentage cached, a value between 0 and 1.
   */
  readonly percentageCached: number;

  /**
   * The estimation of the amount this task will download and store, in bytes.
   *
   * @remarks
   * <br/> - Available only on Web and Android.
   * <br/> - Returns -1 if the estimate is not available yet.
   */
  readonly bytes: number;

  /**
   * The amount downloaded and stored, in bytes.
   */
  readonly bytesCached: number;

  /**
   * The API for license related queries and operations
   */
  readonly license: CachingTaskLicense;

  /**
   * Start caching the media.
   */
  start(): void;

  /**
   * Remove the cached media.
   */
  remove(): void;

  /**
   * Pause caching the media.
   *
   * @remarks
   * <br/> - A paused task can be resumed with {@link CachingTask.start}.
   */
  pause(): void;
}
