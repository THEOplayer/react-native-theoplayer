import { CacheStatus, MediaCacheAPI } from '../../api/cache/MediaCacheAPI';
import type { CachingTaskList } from '../../api/cache/CachingTaskList';
import { DefaultEventDispatcher } from '../adapter/event/DefaultEventDispatcher';
import type { CacheEventMap } from '../../api/cache/events/CacheEvent';
import type { AddCachingTaskEvent, RemoveCachingTaskEvent, SourceDescription } from 'react-native-theoplayer';
import type { CachingTaskParameters } from '../../api/cache/CachingTaskParameters';
import type { CachingTask } from '../../api/cache/CachingTask';
import { NativeEventEmitter, NativeModules } from 'react-native';
import type { CacheStatusChangeEvent } from '../../api/cache/events/CacheStatusChangeEvent';

export class NativeMediaCache extends DefaultEventDispatcher<CacheEventMap> implements MediaCacheAPI {
  private _emitter: NativeEventEmitter = new NativeEventEmitter(NativeModules.CacheModule);
  private _status: CacheStatus = CacheStatus.uninitialised;
  private _tasks: CachingTask[] = [];

  constructor() {
    super();
    this._emitter.addListener('onCacheStatusChange', this.onCacheStatusChange);
    this._emitter.addListener('onCacheAddTaskEvent', this.onCacheAddTaskEvent);
    this._emitter.addListener('onCacheRemoveTaskEvent', this.onCacheRemoveTaskEvent);
  }

  private onCacheStatusChange = (event: CacheStatusChangeEvent) => {
    this._status = event.status;
    this.dispatchEvent(event);
  };

  private onCacheAddTaskEvent = (event: AddCachingTaskEvent) => {
    this._tasks.push(event.task);
    this.dispatchEvent(event);
  };

  private onCacheRemoveTaskEvent = (event: RemoveCachingTaskEvent) => {
    this.dispatchEvent(event);
  };

  async createTask(source: SourceDescription, parameters: CachingTaskParameters): Promise<CachingTask> {
    return NativeModules.CacheModule.createTask(source, parameters);
  }

  get status(): CacheStatus {
    return this._status;
  }

  get tasks(): CachingTaskList {
    return this._tasks;
  }
}

export const MediaCache = new NativeMediaCache();
