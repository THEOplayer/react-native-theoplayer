import { BaseEvent } from './BaseEvent';
import {CacheEventType, CacheStatus, CacheStatusChangeEvent} from 'react-native-theoplayer';
export class DefaultCacheStatusChangeEvent extends BaseEvent<CacheEventType.statechange> implements CacheStatusChangeEvent {
  constructor(public status: CacheStatus) {
    super(CacheEventType.statechange);
  }
}
