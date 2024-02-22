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
import { fromNativeCachingTaskParameters, NativeCachingTaskParameters } from "./NativeCachingTaskParametersAdapter";

const NativeCacheModule = NativeModules.THEORCTCacheModule;

export interface NativeCachingTask {
  readonly id: string;

  readonly status: CacheTaskStatus;

  readonly source: SourceDescription;

  readonly parameters: NativeCachingTaskParameters;

  readonly duration: number;

  readonly cached: TimeRange[];

  readonly secondsCached: number;

  readonly percentageCached: number;

  readonly bytes: number;

  readonly bytesCached: number;
}

export class NativeCachingTaskAdapter extends DefaultEventDispatcher<CachingTaskEventMap> implements CachingTask {
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

  constructor(task: NativeCachingTask) {
    super();
    this.bytes = task.bytes;
    this.cached = { ...task.cached };
    this.duration = task.duration;
    this.id = task.id;
    this.bytesCached = task.bytesCached;
    this.license = {
      renew(drmConfiguration?: DRMConfiguration) {
        NativeCacheModule.renewLicense(task.id, drmConfiguration);
      },
    };
    this.parameters = fromNativeCachingTaskParameters(task.parameters);
    this.percentageCached = task.percentageCached;
    this.secondsCached = task.secondsCached;
    // TODO!
    this.source = { ...task.source };
    this.status = task.status;
  }

  pause(): void {
    NativeCacheModule.pauseCachingTask(this.id);
  }

  remove(): void {
    NativeCacheModule.removeCachingTask(this.id);
  }

  start(): void {
    NativeCacheModule.startCachingTask(this.id);
  }
}
