import { Event } from '../../event/Event';
import { Interstitial } from '../interstitial/Interstitial';

/**
 * Base type for events related to an interstitial.
 *
 * @category THEOads
 * @category Events
 * @public
 */
export interface InterstitialEvent<TType extends string> extends Event<TType> {
  /**
   * The interstitial.
   */
  readonly interstitial: Interstitial;
}

/**
 * The events fired by the {@link TheoAds | THEOads API}.
 *
 * @category THEOads
 * @public
 */
export interface TheoAdsEventsMap {
  /**
   * Fired when an interstitial is added.
   */
  addinterstitial: InterstitialEvent<'addinterstitial'>;

  /**
   * Fired when an interstitial begins.
   */
  interstitialbegin: InterstitialEvent<'interstitialbegin'>;

  /**
   * Fired when an interstitial ends.
   */
  interstitialend: InterstitialEvent<'interstitialend'>;

  /**
   * Fired when an interstitial is updated.
   */
  interstitialupdate: InterstitialEvent<'interstitialupdate'>;

  /**
   * Fired when an interstitial has errored.
   */
  interstitialerror: InterstitialEvent<'interstitialerror'>;
}
