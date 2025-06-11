/**
 * The type of ad source:
 * <br/> - `'vast'`: The source is a VAST resource.
 * <br/> - `'vmap'`: The source is a VMAP resource.
 * <br/> - `'adrule'`: The source is a Ad Rule resource.
 *
 * @remarks
 * <br/> - An ad rule is a simplified VMAP alternative only available in the Google IMA integration.
 *
 * @category Ads
 * @category Source
 * @public
 */
export type AdSourceType = 'vast' | 'vmap' | 'adrule';

/**
 * Describes the source of the ad.
 *
 * @category Ads
 * @category Source
 * @public
 */
export interface AdSource {
  /**
   * The URL of the ad resource.
   */
  src: string;

  /**
   * The type of ad resource.
   *
   * @defaultValue 'vmap' when set through {@link SourceConfiguration.ads} without a time offset, otherwise 'vast'.
   */
  type?: AdSourceType;
}

/**
 * Describes an ad break request.
 *
 * @category Ads
 * @category Source
 * @public
 */
export interface AdDescription {
  /**
   * The integration of the ad break.
   *
   * @defaultValue `'csai'`
   */
  integration?: AdIntegrationKind;

  /**
   * Whether the ad replaces playback of the content.
   *
   * @remarks
   * <br/> - When the ad ends, the content will resume at the ad break's offset plus its duration.
   *
   * @defaultValue
   * <br/> - `true` for live content,
   * <br/> - `false` for VOD content
   */
  replaceContent?: boolean;

  /**
   * A source which contains the location of ad resources to be scheduled.
   *
   * @remarks
   * <br/> - Important: This should *not* be an array of sources.
   * <br/> - VPAID support is limited to the `'google-ima'` integration.
   * <br/> - Not specifying this property should only happen when using a third party ad integration that uses an other system of specifying which ads to schedule
   */
  sources?: string | AdSource;

  /**
   * Offset after which the ad break will start.
   *
   * Possible formats:
   * <br/> - A number for the offset in seconds.
   * <br/> - `'start'` for a preroll.
   * <br/> - `'end'` for a postroll.
   * <br/> - `'HH:MM:SS.mmm'` for a timestamp in the playback window.
   * <br/> - A percentage string (XX%) for a proportion of the content duration.
   *
   * @remarks
   * <br/> - A timestamp which is not in the playback window will result in the ad break not being started.
   * <br/> - VMAP resources will ignore this value as they contain an internal offset.
   *
   * @defaultValue `'start'`
   *
   */
  timeOffset?: string | number;
}

/**
 * The integration of an ad break, represented by a value from the following list:
 * <br/> - `'csai'`: Default CSAI ad playback.
 * <br/> - `'google-ima'`: {@link https://developers.google.com/interactive-media-ads/docs/sdks/html5|Google IMA}.
 * <br/> - `'google-dai'`: {@link https://developers.google.com/ad-manager/dynamic-ad-insertion/sdk/html5 | Google DAI}.
 * <br/> - `'spotx'`: {@link https://developer.spotxchange.com/|SpotX} pre-integrated ad playback.
 * <br/> - `'freewheel'`: {@link https://vi.freewheel.tv/|FreeWheel} pre-integrated ad playback.
 * <br/> - `'theoads'`: [Experimental] - API under development, do not use without consulting THEO Technologies.
 *
 * @remarks
 * <br/> - An empty string defaults to `'theo'`.
 *
 * @category Ads
 * @category Source
 * @public
 */
export enum AdIntegrationKind {
  freewheel = 'freewheel',
  google_ima = 'google-ima',
  google_dai = 'google-dai',
  spotx = 'spotx',
  csai = 'csai',
  theoads = 'theoads',
}
