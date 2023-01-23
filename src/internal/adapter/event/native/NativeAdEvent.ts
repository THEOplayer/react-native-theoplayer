import type { Ad, AdBreak, AdEventType } from 'react-native-theoplayer';

export interface NativeAdEvent {
  /**
   * Type of ad event.
   */
  type: AdEventType;

  /**
   * The ad or adbreak for which the event was dispatched.
   */
  ad: Ad | AdBreak;
}
