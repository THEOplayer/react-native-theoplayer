/**
 * Represents a Verizon Media response with advertisement information for VOD assets.
 *
 * @public
 */
export interface VerizonMediaResponseVodAds {
  /**
   * List of ad break information.
   *
   * @remarks
   * <br/> - This includes both linear and non-linear ads.
   */
  breaks: VerizonMediaResponseVodAdBreak[];

  /**
   * List of ad break offset information.
   */
  breakOffsets: VerizonMediaResponseVodAdBreakOffset[];

  /**
   * List of placeholder offset information.
   */
  placeholderOffsets: VerizonMediaResponseVodAdPlaceholder[];
}

/**
 * Represents a Verizon Media response with ad break information for VOD assets.
 *
 * @public
 */
export interface VerizonMediaResponseVodAdBreak {
  /**
   * The type of the ad break.
   */
  type: 'linear' | 'nonlinear';

  /**
   * The position of the ad break, represented by a value from the following list:
   * <br/> - `'preroll'`: Ad break that plays before the content.
   * <br/> - `'midroll'`: Ad break that plays during the content.
   * <br/> - `'postroll'`: Ad break that plays after the content.
   * <br/> - `'pause'`: Ad break that should be shown when the player is paused.
   * <br/> - `'overlay'`: Non-linear ad break that is shown over the player.
   * <br/> - `''`: Unknown ad break position.
   */
  position: 'preroll' | 'midroll' | 'postroll' | 'pause' | 'overlay' | '';

  /**
   * The time offset of the ad break, in seconds.
   */
  timeOffset: number;

  /**
   * The duration of the ad break, in seconds.
   */
  duration: number;

  /**
   * List of ad information.
   */
  ads: VerizonMediaResponseVodAd[];

  /**
   * A record of all VAST 3.0 tracking events for the ad break.
   * Each entry contains an event name with associated tracking URLs.
   */
  events: Record<string, string[]>;
}

/**
 * The Verizon Media response with ad information for VOD assets.
 *
 * @public
 */
export interface VerizonMediaResponseVodAd {
  /**
   * The duration of the ad, in seconds.
   */
  duration: number;

  /**
   * The API framework, if any.
   *
   * @remarks
   * <br/> - If the value is 'VPAID', then the ad is a VPAID ad.
   * <br/> - Otherwise the ad is an Uplynk CMS asset.
   */
  apiFramework: string | null;

  /**
   * The creative identifier.
   *
   * @remarks
   * <br/> - Either a VPAID URL if the API framework is `'VPAID'`.
   * <br/> - Otherwise an asset ID from the Uplynk CMS.
   */
  creative: string;

  /**
   * The creative's mime type.
   *
   * @remarks
   * <br/> - Either 'application/javascript' if the API framework is `'VPAID'`.
   * <br/> - Otherwise 'uplynk/m3u8'.
   */
  mimeType: string;

  /**
   * The width of the ad, in pixels.
   *
   * @remarks
   * <br/> - Returns `0` when this is not a companion.
   */
  width: number;

  /**
   * The height of the ad, in pixels.
   *
   * @remarks
   * <br/> - Returns `0` when this is not a companion.
   */
  height: number;

  /**
   * List of companion ads of the ad.
   */
  companions: VerizonMediaResponseVodAd[];

  /**
   * List of VAST extensions returned by the ad server.
   */
  extensions?: Record<string, unknown>[];

  /**
   * Record of FreeWheel-defined creative parameters.
   * Each entry contains the parameter name together with the associated value.
   */
  fw_parameters?: Record<string, string>;

  /**
   * A record of all VAST 3.0 tracking events for the ad.
   * Each entry contains an event name with associated tracking URLs.
   */
  events: Record<string, string[]>;
}

/**
 * Represents the offset of a Verizon Media ad break.
 *
 * @public
 */
export interface VerizonMediaResponseVodAdBreakOffset {
  /**
   * The index of the ad break in the ads.breaks array.
   */
  index: number;

  /**
   * The time offset of the ad break, in seconds.
   */
  timeOffset: number;
}

/**
 * Represents a Verizon Media response with a placeholder for an ad for VOD assets.
 *
 * @remarks
 * A placeholder is an ad which
 * <br/> - is a short blank video for non-video ads (e.g. VPAID ads).
 * <br/> - is a system asset which is potentially subject to change.
 *
 * @public
 */
export interface VerizonMediaResponseVodAdPlaceholder {
  /**
   * The index of the placeholder's ad break in the `ads.breaks` array.
   */
  breaksIndex: number;

  /**
   * The index of the placeholder in the `ads.breaks.ads` array.
   */
  adsIndex: number;

  /**
   * The start time of the placeholder, in seconds.
   */
  startTime: number;

  /**
   * The end time of the placeholder, in seconds.
   */
  endTime: number;
}
