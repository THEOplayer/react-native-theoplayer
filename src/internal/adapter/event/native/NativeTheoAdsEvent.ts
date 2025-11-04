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

export function fromNativeTheoAdsEvent(node: number, event: NativeSyntheticEvent<NativeTheoAdsEvent>): TheoAdsEvent | undefined {
  const { type, nativeEvent } = event;
  switch (type) {
    case TheoAdsEventType.INTERSTITIAL_ERROR:
      return new DefaultTheoAdsErrorEvent(
        TheoAdsEventType.INTERSTITIAL_ERROR,
        createNativeInterstitial(node, nativeEvent.interstitial),
        nativeEvent.message,
      );
    case TheoAdsEventType.ADD_INTERSTITIAL:
    case TheoAdsEventType.INTERSTITIAL_BEGIN:
    case TheoAdsEventType.INTERSTITIAL_END:
    case TheoAdsEventType.INTERSTITIAL_UPDATE:
      return new DefaultTheoAdsEvent(type, createNativeInterstitial(node, nativeEvent.interstitial));
    default:
      return undefined;
  }
}
