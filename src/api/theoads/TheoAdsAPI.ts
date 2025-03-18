import { Interstitial } from './interstitial/Interstitial';

/**
 * The THEOads API.
 *
 * @remarks
 * <br/> - Available since v8.17.0.
 *
 * @category THEOads
 * @public
 */
export interface TheoAdsAPI {
  /**
   * The currently playing interstitials.
   */
  currentInterstitials: readonly Interstitial[];

  /**
   * List of interstitials which still need to be played.
   */
  scheduledInterstitials: readonly Interstitial[];

  /**
   * Replaces all the ad tag parameters used for upcoming ad requests for a live stream.
   *
   * @param adTagParameters - The new ad tag parameters.
   *
   * @remarks
   * <br/> - If set, this value overrides any parameters set on the {@link TheoAdDescription.adTagParameters}.
   */
  replaceAdTagParameters(adTagParameters?: Record<string, string>): void;
}

