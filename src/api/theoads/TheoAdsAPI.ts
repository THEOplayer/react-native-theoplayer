import { Interstitial } from './interstitial/Interstitial';

/**
 * The THEOads API.
 *
 * @since React Native THEOplayer SDK v8.17.0.
 *
 * @category Ads
 * @category THEOads
 * @public
 */
export interface TheoAdsAPI {
  /**
   * The currently playing interstitials.
   */
  currentInterstitials: Promise<readonly Interstitial[]>;

  /**
   * List of interstitials which still need to be played.
   */
  scheduledInterstitials: Promise<readonly Interstitial[]>;

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

