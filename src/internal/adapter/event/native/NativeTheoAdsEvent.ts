import { Interstitial, TheoAdsEvent, TheoAdsEventType } from 'react-native-theoplayer';
import { NativeSyntheticEvent } from 'react-native';
import { DefaultTheoAdsErrorEvent, DefaultTheoAdsEvent } from '../PlayerEvents';
import { createNativeInterstitial } from '../../theoads/NativeInterstitialAdapter';

export interface NativeTheoAdsEvent {
  /**
   * Type of TheoAds event.
   */
  type: TheoAdsEventType;

  /**
   * Interstitial referred to by the TheoAds event.
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
      return new DefaultTheoAdsErrorEvent(
        TheoAdsEventType.INTERSTITIAL_ERROR,
        createNativeInterstitial(nativeEvent.interstitial),
        nativeEvent.message,
      );
    default:
      return new DefaultTheoAdsEvent(event.type as TheoAdsEventType, createNativeInterstitial(nativeEvent.interstitial));
  }
}
