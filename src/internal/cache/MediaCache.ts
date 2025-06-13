import { CacheStatus, MediaCacheAPI } from '../../api/cache/MediaCacheAPI';
import type { CachingTaskList } from '../../api/cache/CachingTaskList';
import { DefaultEventDispatcher } from '../adapter/event/DefaultEventDispatcher';
import type { CacheEventMap } from '../../api/cache/events/CacheEvent';
import { CacheEventType } from '../../api/cache/events/CacheEvent';
import type { CachingTaskProgressEvent, CachingTaskStatusChangeEvent, SourceDescription } from 'react-native-theoplayer';
import { CacheTaskStatus, CachingTaskEventType, TimeRange } from 'react-native-theoplayer';
import type { CachingTaskParameters } from '../../api/cache/CachingTaskParameters';
import type { CachingTask } from '../../api/cache/CachingTask';
import { NativeEventEmitter, NativeModules } from 'react-native';
import { NativeCachingTask, NativeCachingTaskAdapter } from './NativeCachingTaskAdapter';
import { toNativeCachingTaskParameters } from './NativeCachingTaskParametersAdapter';

const TAG = 'NativeMediaCache';

const NativeCacheModule = NativeModules.THEORCTCacheModule;

interface NativeCachingStatusChangeEvent {
  readonly id: string;
  readonly status: CacheTaskStatus;
}

interface NativeCacheStatusChangeEvent {
  readonly status: CacheStatus;
}

interface NativeAddCachingTaskEvent {
  readonly task: NativeCachingTask;
}

interface NativeRemoveCachingTaskEvent {
  readonly task: NativeCachingTask;
}

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

export class NativeMediaCache extends DefaultEventDispatcher<CacheEventMap> implements MediaCacheAPI {
  private _emitter: NativeEventEmitter = new NativeEventEmitter(NativeCacheModule);
  private _status: CacheStatus = CacheStatus.uninitialised;
  private _tasks: NativeCachingTaskAdapter[] = [];

  constructor() {
    super();
    this._emitter.addListener('onCacheStatusChange', this.onCacheStatusChange);
    this._emitter.addListener('onAddCachingTaskEvent', this.onAddCachingTaskEvent);
    this._emitter.addListener('onRemoveCachingTaskEvent', this.onRemoveCachingTaskEvent);
    this._emitter.addListener('onCachingTaskProgressEvent', this.onCachingTaskProgressEvent);
    this._emitter.addListener('onCachingTaskStatusChangeEvent', this.onCachingTaskStatusChangeEvent);
    void this.initialize();
  }

  async createTask(source: SourceDescription, parameters: CachingTaskParameters): Promise<CachingTask> {
    return NativeCacheModule.createTask(source, toNativeCachingTaskParameters(parameters));
  }

  get status(): CacheStatus {
    return this._status;
  }

  get tasks(): CachingTaskList {
    return this._tasks;
  }

  private async initialize(): Promise<void> {
    await this.getInitialState();

    // Dispatch status change event here
    if (this._status === CacheStatus.initialised) {
      await this.onCacheStatusChange({
        status: this._status,
      });
    }
  }

  private async getInitialState(): Promise<void> {
    const initialState = await NativeCacheModule.getInitialState();
    this._status = initialState.status;
    this._tasks = initialState.tasks.map((task: NativeCachingTask) => new NativeCachingTaskAdapter(task));
  }

  private onCacheStatusChange = async (event: NativeCacheStatusChangeEvent) => {
    if (this._status === CacheStatus.uninitialised) {
      await this.getInitialState();
    }
    this._status = event.status;
    this.dispatchEvent({
      type: CacheEventType.statechange,
      date: new Date(),
    });
  };

  private onAddCachingTaskEvent = (event: NativeAddCachingTaskEvent) => {
    const task = new NativeCachingTaskAdapter(event.task);
    this._tasks.push(task);
    this.dispatchEvent({
      type: CacheEventType.addtask,
      task,
      date: new Date(),
    });
  };

  private onRemoveCachingTaskEvent = (event: NativeRemoveCachingTaskEvent) => {
    const task = this.taskById(event.task.id);
    if (task) {
      this._tasks = this._tasks.filter((task) => task.id !== event.task.id);
      this.dispatchEvent({
        type: CacheEventType.removetask,
        task,
        date: new Date(),
      });
    } else {
      console.warn(TAG, `onRemoveCachingTaskEvent: CachingTask with id ${event.task.id} not found.`);
    }
  };

  private onCachingTaskProgressEvent = (event: NativeCachingTaskProgressEvent) => {
    const task = this.taskById(event.id);
    if (task) {
      Object.assign(task, { ...event.progress });
      task.dispatchEvent({
        type: CachingTaskEventType.progress,
        date: new Date(),
      } as CachingTaskProgressEvent);
    }
  };

  private onCachingTaskStatusChangeEvent = (event: NativeCachingStatusChangeEvent) => {
    const task = this.taskById(event.id);
    if (task) {
      Object.assign(task, { ...event });
      task.dispatchEvent({
        type: CachingTaskEventType.statechange,
        date: new Date(),
      } as CachingTaskStatusChangeEvent);
    }
  };

  private taskById(id: string): NativeCachingTaskAdapter | undefined {
    return this._tasks.find((task) => task.id === id);
  }
}

/**
 * The media cache API.
 *
 * @category Caching
 * @public
 */
export const MediaCache: MediaCacheAPI = new NativeMediaCache();
