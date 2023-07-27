import type { CacheStatus, MediaCacheAPI } from 'react-native-theoplayer';
import type { CachingTaskList } from 'react-native-theoplayer';
import { DefaultEventDispatcher } from '../adapter/event/DefaultEventDispatcher';
import type { CacheEventMap } from 'react-native-theoplayer';
import type { SourceDescription } from 'react-native-theoplayer';
import type { CachingTaskParameters } from 'react-native-theoplayer';
import type { CachingTask } from 'react-native-theoplayer';
import * as THEOplayerWeb from 'theoplayer';

export class WebMediaCache extends DefaultEventDispatcher<CacheEventMap> implements MediaCacheAPI {
  createTask(source: SourceDescription, parameters: CachingTaskParameters): Promise<CachingTask> {
    return Promise.resolve(THEOplayerWeb.cache.createTask(source, parameters) as CachingTask);
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
