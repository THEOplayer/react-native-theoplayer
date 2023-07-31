import { DefaultEventDispatcher } from '../adapter/event/DefaultEventDispatcher';
import type {
  CachingTask,
  CachingTaskEventMap,
  CachingTaskLicense,
  CachingTaskParameters,
  SourceDescription,
  TimeRange,
} from 'react-native-theoplayer';
import type { CacheTaskStatus } from 'react-native-theoplayer';
import { NativeModules } from 'react-native';
import type { DRMConfiguration } from 'react-native-theoplayer';

export class CachingTaskAdapter extends DefaultEventDispatcher<CachingTaskEventMap> implements CachingTask {
  readonly bytes: number;
  readonly bytesCached: number;
  readonly cached: TimeRange[];
  readonly duration: number;
  readonly id: string;
  readonly license: CachingTaskLicense;
  readonly parameters: CachingTaskParameters;
  readonly percentageCached: number;
  readonly secondsCached: number;
  readonly source: SourceDescription;
  readonly status: CacheTaskStatus;

  constructor(task: CachingTask) {
    super();
    this.bytes = task.bytes;
    this.cached = { ...task.cached };
    this.duration = task.duration;
    this.id = task.id;
    this.bytesCached = task.bytesCached;
    this.license = {
      renew(drmConfiguration?: DRMConfiguration) {
        NativeModules.CacheModule.renewLicense(task.id, drmConfiguration);
      },
    };
    this.parameters = { ...task.parameters };
    this.percentageCached = task.percentageCached;
    this.secondsCached = task.secondsCached;
    // TODO!
    this.source = { ...task.source };
    this.status = task.status;
  }

  pause(): void {
    NativeModules.CacheModule.pauseCachingTask(this.id);
  }

  remove(): void {
    NativeModules.CacheModule.removeCachingTask(this.id);
  }

  start(): void {
    NativeModules.CacheModule.startCachingTask(this.id);
  }
}
