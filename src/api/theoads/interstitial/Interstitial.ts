/**
 * The type of the interstitial.
 *
 * @category Ads
 * @category THEOads
 * @public
 */
export type InterstitialType = 'adbreak' | 'overlay';

/**
 * The THEOads interstitial.
 *
 * @category Ads
 * @category THEOads
 * @public
 */
export interface Interstitial {
  /**
   * The type of the interstitial.
   */
  type: InterstitialType;

  /**
   * The identifier of the interstitial.
   */
  id: string;

  /**
   * The start time at which the interstitial will start.
   */
  startTime: number;

  /**
   * The duration of the interstitial, in seconds.
   *
   */
  duration: number | undefined;

  /**
   * The ad tag parameters that are used for this specific ad break.
   * @remarks
   * <br/> - The set values are combined and potentially override parameters set on the {@link TheoAdDescription.adTagParameters} or through {@link TheoAds.replaceAdTagParameters}.
   */
  adTagParameters: Record<string, string>;
}
