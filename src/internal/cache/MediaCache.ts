import { CacheStatus, MediaCacheAPI } from '../../api/cache/MediaCacheAPI';
import type { CachingTaskList } from '../../api/cache/CachingTaskList';
import { DefaultEventDispatcher } from '../adapter/event/DefaultEventDispatcher';
import type { CacheEventMap, CacheStatusChangeEvent } from '../../api/cache/events/CacheEvent';
import type { AddCachingTaskEvent, RemoveCachingTaskEvent, SourceDescription } from 'react-native-theoplayer';
import type { CachingTaskParameters } from '../../api/cache/CachingTaskParameters';
import type { CachingTask } from '../../api/cache/CachingTask';
import { NativeEventEmitter, NativeModules } from 'react-native';
import { CachingTaskAdapter } from './CachingTaskAdapter';
import { CacheTaskStatus, CachingTaskEventType, TimeRange } from 'react-native-theoplayer';

interface NativeCachingTaskProgressEvent {
  id: string;
  progress: {
    readonly duration: number;
    readonly cached: TimeRange[];
    readonly secondsCached: number;
    readonly percentageCached: number;
    readonly bytes: number;
    readonly bytesCached: number;
  };
}

interface NativeCachingStatusChangeEvent {
  readonly id: string;
  readonly status: CacheTaskStatus;
}

export class NativeMediaCache extends DefaultEventDispatcher<CacheEventMap> implements MediaCacheAPI {
  private _emitter: NativeEventEmitter = new NativeEventEmitter(NativeModules.CacheModule);
  private _status: CacheStatus = CacheStatus.uninitialised;
  private _tasks: CachingTaskAdapter[] = [];

  constructor() {
    super();
    this._emitter.addListener('onCacheStatusChange', this.onCacheStatusChange);
    this._emitter.addListener('onAddCachingTaskEvent', this.onAddCachingTaskEvent);
    this._emitter.addListener('onRemoveCachingTaskEvent', this.onRemoveCachingTaskEvent);
    this._emitter.addListener('onCachingTaskProgressEvent', this.onCachingTaskProgressEvent);
    this._emitter.addListener('onCachingTaskStatusChangeEvent', this.onCachingTaskStatusChangeEvent);
  }

  private onCacheStatusChange = (event: CacheStatusChangeEvent) => {
    this._status = event.status;
    this.dispatchEvent(event);
  };

  private onAddCachingTaskEvent = (event: AddCachingTaskEvent) => {
    console.log('TVL', 'onCacheAddTaskEvent', JSON.stringify(event));
    this._tasks.push(new CachingTaskAdapter(event.task));
    this.dispatchEvent(event);
  };

  private onRemoveCachingTaskEvent = (event: RemoveCachingTaskEvent) => {
    this._tasks = this._tasks.filter((task) => task.id !== event.task.id);
    this.dispatchEvent(event);
  };

  private onCachingTaskProgressEvent = (event: NativeCachingTaskProgressEvent) => {
    console.log('TVL', 'onCachingTaskProgressEvent', JSON.stringify(event));
    const task = this.taskById(event.id);
    if (task) {
      Object.assign(task, { ...event.progress });
      task.dispatchEvent({
        type: CachingTaskEventType.progress,
        date: new Date(),
      });
    }
  };

  private onCachingTaskStatusChangeEvent = (event: NativeCachingStatusChangeEvent) => {
    console.log('TVL', 'onCachingTaskStatusChangeEvent', JSON.stringify(event));
    const task = this.taskById(event.id);
    if (task) {
      Object.assign(task, { ...event });
      task.dispatchEvent({
        type: CachingTaskEventType.statechange,
        date: new Date(),
      });
    }
  };

  async createTask(source: SourceDescription, parameters: CachingTaskParameters): Promise<CachingTask> {
    return NativeModules.CacheModule.createTask(source, parameters);
  }

  get status(): CacheStatus {
    return this._status;
  }

  get tasks(): CachingTaskList {
    console.log('TVL', 'TASKS', JSON.stringify(this._tasks));
    return this._tasks;
  }

  private taskById(id: string): CachingTaskAdapter | undefined {
    return this._tasks.find((task) => task.id === id);
  }
}

export const MediaCache = new NativeMediaCache();
