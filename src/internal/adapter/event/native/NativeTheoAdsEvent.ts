import { Interstitial, TheoAdsEvent, TheoAdsEventType } from 'react-native-theoplayer';
import { NativeSyntheticEvent } from 'react-native';
import { DefaultTheoAdsErrorEvent, DefaultTheoAdsEvent } from '../PlayerEvents';

export interface NativeTheoAdsEvent {
  /**
   * Type of TheoLive event.
   */
  type: TheoAdsEventType;

  /**
   * Interstitial refered to by the TheoLive event.
   */
  interstitial: Interstitial;

  /**
   * Error message, in case of an INTERSTITIAL_ERROR event.
   */
  message: string | undefined;
}

export function fromNativeTheoAdsEvent(event: NativeSyntheticEvent<NativeTheoAdsEvent>): TheoAdsEvent {
  const { nativeEvent } = event;
  switch (event.type) {
    case TheoAdsEventType.INTERSTITIAL_ERROR:
      return new DefaultTheoAdsErrorEvent(TheoAdsEventType.INTERSTITIAL_ERROR, nativeEvent.interstitial, nativeEvent.message);
    default:
      return new DefaultTheoAdsEvent(event.type as TheoAdsEventType, nativeEvent.interstitial);
  }
}
