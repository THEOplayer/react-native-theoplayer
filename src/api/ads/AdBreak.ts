/**
 * Represents an ad break in the VMAP specification or an ad pod in the VAST specification.
 *
 * @category Ads
 * @public
 */
import type { Ad } from './Ad';

/**
 * Represents an ad break in the VMAP specification or an ad pod in the VAST specification.
 *
 * @category Ads
 * @public
 */
export interface AdBreak {
  /**
   * The integration of the ad break, represented by a value from the following list:
   * <br/> - `'theo'`
   * <br/> - `'google-ima'`
   * <br/> - `'google-dai'`
   * <br/> - `'freewheel'`
   */
  integration: string | undefined;

  /**
   * List of ads which will be played sequentially at the ad break's time offset.
   */
  ads: Ad[] | undefined;

  /**
   * The time offset at which content will be paused to play the ad break, in seconds.
   */
  timeOffset: number;

  /**
   * The duration of the ad break, in seconds.
   *
   * @remarks
   * <br/> - Ads are lazily loaded. This property becomes available when all ads are loaded.
   */
  maxDuration: number | undefined;

  /**
   * The remaining duration of the ad break, in seconds.
   *
   * @remarks
   * <br/> - Ads are lazily loaded. This property becomes available when all ads are loaded.
   * <br/> - This feature is not available in the Google IMA integration and will default to -1.
   */
  maxRemainingDuration: number | undefined;
}
