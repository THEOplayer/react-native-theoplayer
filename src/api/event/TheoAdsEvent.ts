import { Event, PlayerEventType } from 'react-native-theoplayer';
import { Interstitial } from '../theoads/interstitial/Interstitial';

/**
 * The THEOads event dispatched by the {@link AdsAPI | Ads API}.
 *
 * @category Events
 * @category THEOads
 * @public
 */
export interface TheoAdsEvent extends Event<PlayerEventType.THEOADS_EVENT> {
  /**
   * Type of THEOads event.
   */
  subType: TheoAdsEventType;

  /**
   * The interstitial for which the event was dispatched.
   */
  interstitial: Interstitial;
}

/**
 * The THEOads event types dispatched by the {@link AdsAPI | Ads API}.
 *
 * @category Events
 * @category THEOads
 * @public
 */
export enum TheoAdsEventType {
  /**
   * Fired when an interstitial is added.
   */
  ADD_INTERSTITIAL = 'addinterstitial',

  /**
   * Fired when an interstitial begins.
   */
  INTERSTITIAL_BEGIN = 'interstitialbegin',

  /**
   * Fired when an interstitial ends.
   */
  INTERSTITIAL_END = 'interstitialend',

  /**
   * Fired when an interstitial is updated.
   */
  INTERSTITIAL_UPDATE = 'interstitialupdate',

  /**
   * Fired when an interstitial has errored.
   */
  INTERSTITIAL_ERROR = 'interstitialerror'
}
