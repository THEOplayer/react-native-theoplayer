import type { CacheStatus, MediaCacheAPI } from '../../api/cache/MediaCacheAPI';
import type { CachingTaskList } from '../../api/cache/CachingTaskList';
import { DefaultEventDispatcher } from '../adapter/event/DefaultEventDispatcher';
import type { CacheEventMap } from '../../api/cache/events/CacheEvent';
import type { SourceDescription } from 'react-native-theoplayer';
import type { CachingTaskParameters } from '../../api/cache/CachingTaskParameters';
import type { CachingTask } from '../../api/cache/CachingTask';
import * as THEOplayerWeb from 'theoplayer';

export class WebMediaCache extends DefaultEventDispatcher<CacheEventMap> implements MediaCacheAPI {
  // @ts-ignore
  createTask(source: SourceDescription, parameters: CachingTaskParameters): CachingTask {
    return THEOplayerWeb.cache.createTask(source, parameters) as CachingTask;
  }

  get status(): CacheStatus {
    return THEOplayerWeb.cache.status as CacheStatus;
  }

  // @ts-ignore
  get tasks(): CachingTaskList {
    return THEOplayerWeb.cache.tasks as CachingTaskList;
  }
}

export const MediaCache = new WebMediaCache();
