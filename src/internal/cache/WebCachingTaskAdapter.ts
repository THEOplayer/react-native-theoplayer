import type {
  CachingTask,
  CachingTaskEventMap,
  CachingTaskLicense,
  CachingTaskParameters,
  SourceDescription,
  TimeRange,
} from 'react-native-theoplayer';

import type { CachingTask as WebCachingTask, CachingTaskEventMap as WebCachingTaskEventMap } from 'theoplayer';
import type { CacheTaskStatus } from 'react-native-theoplayer';
import type { StringKeyOf } from '../../api/event/EventDispatcher';
import type { EventListener } from '../../api/event/EventListener';

export class WebCachingTaskAdapter implements CachingTask {
  constructor(private webCachingTask: WebCachingTask) {}

  get bytes(): number {
    return this.webCachingTask.bytes;
  }

  get bytesCached(): number {
    return this.webCachingTask.bytesCached;
  }

  get cached(): TimeRange[] {
    return fromTimeRanges(this.webCachingTask.cached);
  }

  get duration(): number {
    return this.webCachingTask.duration;
  }

  get id(): string {
    return this.webCachingTask.id;
  }

  get license(): CachingTaskLicense {
    return this.webCachingTask.license;
  }

  get parameters(): CachingTaskParameters {
    return this.webCachingTask.parameters;
  }

  get percentageCached(): number {
    return this.webCachingTask.percentageCached;
  }

  get secondsCached(): number {
    return this.webCachingTask.secondsCached;
  }

  get source(): SourceDescription {
    return this.webCachingTask.source as SourceDescription;
  }

  get status(): CacheTaskStatus {
    return this.webCachingTask.status as CacheTaskStatus;
  }

  start(): void {
    this.webCachingTask.start();
  }

  pause(): void {
    this.webCachingTask.pause();
  }

  remove(): void {
    this.webCachingTask.remove();
  }

  addEventListener<TType extends StringKeyOf<CachingTaskEventMap>>(type: TType[] | TType, listener: EventListener<CachingTaskEventMap[TType]>) {
    this.webCachingTask.addEventListener(type, listener as EventListener<WebCachingTaskEventMap[TType]>);
  }

  removeEventListener<TType extends StringKeyOf<CachingTaskEventMap>>(
    type: TType[] | TType,
    listener: EventListener<CachingTaskEventMap[TType]>,
  ): void {
    this.webCachingTask.removeEventListener(type, listener as EventListener<WebCachingTaskEventMap[TType]>);
  }
}

function fromTimeRanges(timeRanges: TimeRanges): TimeRange[] {
  const result: TimeRange[] = [];
  for (let i = 0; i < timeRanges.length; i++) {
    result.push({
      start: timeRanges.start(i) * 1e3,
      end: timeRanges.end(i) * 1e3,
    });
  }
  return result;
}
