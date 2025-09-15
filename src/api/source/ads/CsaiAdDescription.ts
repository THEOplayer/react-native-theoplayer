import type { AdDescription, AdSource } from "./Ads";

/**
 * Describes an ad break request.
 *
 * @category Ads
 * @public
 */
export interface CsaiAdDescription extends AdDescription {
  /**
   * The source of the ad
   *
   * @remarks
   * <br/> - Only supports VAST and VMAP.
   */
  sources: string | AdSource;

  /**
   * Offset after which the ad break can be skipped.
   *
   * @remarks
   * <br/> - A timestamp which is not in the playback window will result in the ad break not being started.
   * <br/> - VMAP resources will ignore this value as they contain an internal offset.
   *
   * Possible formats:
   * <br/> - A number for the offset in seconds.
   * <br/> - `'start'` for a preroll.
   * <br/> - `'end'` for a postroll.
   * <br/> - `'HH:MM:SS.mmm'` for a timestamp in the playback window.
   * <br/> - A percentage string (XX%) for a proportion of the content duration.
   *
   * @defaultValue `'start'`
   */
  skipOffset?: string | number;
}
