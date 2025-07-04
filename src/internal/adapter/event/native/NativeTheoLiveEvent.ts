import { TheoLiveEventType } from 'react-native-theoplayer';

export interface NativeTheoLiveEvent {
  /**
   * Type of TheoLive event.
   */
  type: TheoLiveEventType;

  /**
   * The distribution identifier for DISTRIBUTION_LOAD_START or DISTRIBUTION_OFFLINE events
   */
  distributionId: string | undefined;
}
