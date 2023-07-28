import { CacheStatus, MediaCacheAPI } from '../../api/cache/MediaCacheAPI';
import type { CachingTaskList } from '../../api/cache/CachingTaskList';
import { DefaultEventDispatcher } from '../adapter/event/DefaultEventDispatcher';
import type { CacheEventMap, CacheStatusChangeEvent } from '../../api/cache/events/CacheEvent';
import type {
  AddCachingTaskEvent,
  CachingTaskProgressEvent,
  CachingTaskStatusChangeEvent,
  RemoveCachingTaskEvent,
  SourceDescription,
} from 'react-native-theoplayer';
import type { CachingTaskParameters } from '../../api/cache/CachingTaskParameters';
import type { CachingTask } from '../../api/cache/CachingTask';
import { NativeEventEmitter, NativeModules } from 'react-native';
import { CachingTaskAdapter } from './CachingTaskAdapter';

export class NativeMediaCache extends DefaultEventDispatcher<CacheEventMap> implements MediaCacheAPI {
  private _emitter: NativeEventEmitter = new NativeEventEmitter(NativeModules.CacheModule);
  private _status: CacheStatus = CacheStatus.uninitialised;
  private _tasks: CachingTaskAdapter[] = [];

  constructor() {
    super();
    this._emitter.addListener('onCacheStatusChange', this.onCacheStatusChange);
    this._emitter.addListener('onCacheAddTaskEvent', this.onCacheAddTaskEvent);
    this._emitter.addListener('onCacheRemoveTaskEvent', this.onCacheRemoveTaskEvent);
    this._emitter.addListener('onCachingTaskProgressEvent', this.onCachingTaskProgressEvent);
    this._emitter.addListener('onCachingTaskStatusChangeEvent', this.onCachingTaskStatusChangeEvent);
  }

  private onCacheStatusChange = (event: CacheStatusChangeEvent) => {
    this._status = event.status;
    this.dispatchEvent(event);
  };

  private onCacheAddTaskEvent = (event: AddCachingTaskEvent) => {
    this._tasks.push(new CachingTaskAdapter(event.task));
    this.dispatchEvent(event);
  };

  private onCacheRemoveTaskEvent = (event: RemoveCachingTaskEvent) => {
    this._tasks = this._tasks.filter((task) => task.id !== event.task.id);
    this.dispatchEvent(event);
  };

  private onCachingTaskProgressEvent = (event: CachingTaskProgressEvent) => {
    const task = this.taskById(event.id);
    if (task) {
      task.dispatchEvent(event);
    }
  };

  private onCachingTaskStatusChangeEvent = (event: CachingTaskStatusChangeEvent) => {
    const task = this.taskById(event.id);
    if (task) {
      task.dispatchEvent(event);
    }
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

  private taskById(id: string): CachingTaskAdapter | undefined {
    return this._tasks.find((task) => task.id === id);
  }
}

export const MediaCache = new NativeMediaCache();
