import { BaseEvent } from './BaseEvent';
import { CacheEventType, CacheStatus } from 'react-native-theoplayer';
import type { CacheStatusChangeEvent } from '../../../api/cache/events/CacheStatusChangeEvent';

export class DefaultCacheStatusChangeEvent extends BaseEvent<CacheEventType.statechange> implements CacheStatusChangeEvent {
  constructor(public status: CacheStatus) {
    super(CacheEventType.statechange);
  }
}
