import { CacheStatus, MediaCacheAPI } from '../../api/cache/MediaCacheAPI';
import type { CachingTaskList } from '../../api/cache/CachingTaskList';
import { DefaultEventDispatcher } from '../adapter/event/DefaultEventDispatcher';
import type { CacheEventMap } from '../../api/cache/events/CacheEvent';
import type { SourceDescription } from 'react-native-theoplayer';
import type { CachingTaskParameters } from '../../api/cache/CachingTaskParameters';
import type { CachingTask } from '../../api/cache/CachingTask';

export class NativeMediaCache extends DefaultEventDispatcher<CacheEventMap> implements MediaCacheAPI {
  // @ts-ignore
  createTask(source: SourceDescription, parameters: CachingTaskParameters): CachingTask {
    // TODO
  }

  get status(): CacheStatus {
    // TODO
    return CacheStatus.uninitialised;
  }

  // @ts-ignore
  get tasks(): CachingTaskList {
    // TODO
  }
}

export const MediaCache = new NativeMediaCache();
