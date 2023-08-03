import type { CacheStatus, MediaCacheAPI } from 'react-native-theoplayer';
import type { CachingTaskList } from 'react-native-theoplayer';
import { DefaultEventDispatcher } from '../adapter/event/DefaultEventDispatcher';
import type { CacheEventMap } from 'react-native-theoplayer';
import type { SourceDescription } from 'react-native-theoplayer';
import type { CachingTaskParameters } from 'react-native-theoplayer';
import type { CachingTask } from 'react-native-theoplayer';
import * as THEOplayerWeb from 'theoplayer';
import { WebCachingTaskAdapter } from './WebCachingTaskAdapter';
import type { AddCachingTaskEvent, RemoveCachingTaskEvent } from 'theoplayer';
import { CacheEventType } from 'react-native-theoplayer';

export class WebMediaCache extends DefaultEventDispatcher<CacheEventMap> implements MediaCacheAPI {
  constructor() {
    super();
    THEOplayerWeb.cache.tasks.addEventListener('addtask', this.onAddTask);
    THEOplayerWeb.cache.tasks.addEventListener('removetask', this.onRemoveTask);
  }

  private onAddTask = (event: AddCachingTaskEvent) => {
    this.dispatchEvent({
      type: CacheEventType.addtask,
      task: new WebCachingTaskAdapter(event.task),
      date: event.date,
    });
  };

  private onRemoveTask = (event: RemoveCachingTaskEvent) => {
    this.dispatchEvent({
      type: CacheEventType.removetask,
      task: new WebCachingTaskAdapter(event.task),
      date: event.date,
    });
  };

  createTask(source: SourceDescription, parameters: CachingTaskParameters): Promise<CachingTask> {
    return Promise.resolve(new WebCachingTaskAdapter(THEOplayerWeb.cache.createTask(source, parameters)));
  }

  get status(): CacheStatus {
    return THEOplayerWeb.cache.status as CacheStatus;
  }

  // @ts-ignore
  get tasks(): CachingTaskList {
    return THEOplayerWeb.cache.tasks.map((task) => new WebCachingTaskAdapter(task)) as CachingTaskList;
  }
}

export const MediaCache = new WebMediaCache();

// Expose cache for easy access
// @ts-ignore
window.MediaCache = MediaCache;
