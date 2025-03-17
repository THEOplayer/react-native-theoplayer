/**
 * The type of the interstitial.
 *
 * @category THEOads
 * @public
 */
export type InterstitialType = 'adbreak' | 'overlay';

/**
 * The THEOads interstitial.
 *
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
}
