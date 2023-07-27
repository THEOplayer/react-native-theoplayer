import type { CacheEventType, Event } from 'react-native-theoplayer';
import type { CacheStatus } from 'react-native-theoplayer';

export interface CacheStatusChangeEvent extends Event<CacheEventType.statechange> {
  /**
   * The cache's new status.
   */
  readonly status: CacheStatus;
}
