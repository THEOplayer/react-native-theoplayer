import { AdDescription, AdIntegrationKind } from './Ads';

/**
 * Describes a THEOads ad break request.
 *
 * @remarks
 * <br/> - For THEOads, one configured ad break request enables server guided ad playback for the entire stream.
 *
 * @category Ads
 */
export interface TheoAdDescription extends AdDescription {
  /**
   * The integration of the ad break.
   */
  integration: AdIntegrationKind.theoads;

  /**
   * For SGAI, this should be configured with the signaling server base URI.
   *
   * If configured, the player will attempt to sideload the modified manifest from the signaling server separate from the source manifest.
   * If not configured, the player will assume that the ad markers are part of the source manifest.
   */
  sources?: string;

  /**
   * Default network code to use for ad requests.
   *
   * @remarks
   * <br/> - This will be overridden by network codes parsed from THEOads ad markers.
   * <br/> - If no network code is configured, and it cannot be parsed from the THEOads ad marker, ads will not be loaded.
   */
  networkCode?: string;

  /**
   * Default custom asset key to use for ad requests.
   *
   * @remarks
   * <br/> - This will be overridden by custom asset keys parsed from THEOads ad markers.
   * <br/> - If no custom asset key is configured, and it cannot be parsed from the THEOads ad marker, ads will not be loaded.
   */
  customAssetKey?: string;

  /**
   * Default backdrop image URI to be used as a background for ads in double box layout.
   *
   * @remarks
   * <br/> - This will be overridden by backdrop image URIs parsed from THEOads ad markers or returned in the ad response.
   * <br/> - If no URI is configured, and no backdrop companion is parsed from the marker or returned in the ad response, a black screen will be shown as background.
   */
  backdropDoubleBox?: string;

  /**
   * Default backdrop image URI to be used as a background for ads in L-shape layout.
   *
   * @remarks
   * <br/> - This will be overridden by backdrop image URIs parsed from THEOads ad markers or returned in the ad response.
   * <br/> - If no URI is configured, and no backdrop companion is parsed from the marker or returned in the ad response, a black screen will be shown as background.
   */
  backdropLShape?: string;

  /**
   * Override the layout of all THEOads ad breaks, if set.
   */
  overrideLayout?: TheoAdsLayoutOverride;

  /**
   * The ad tag parameters added to stream request.
   *
   * @remarks
   * <br/> - Each entry contains the parameter name with associated value.
   * <br/> - Values added must be strings.
   */
  adTagParameters?: Record<string, string>;

  /**
   * The streamActivityMonitorId added to the GAM Pod stream request.
   *
   * @platform web
   *
   * @since React Native THEOplayer SDK v8.17.0.
   */
  streamActivityMonitorId?: string;

  /**
   * Whether to use the Id3 based operating mode.
   *
   * @defaultValue `false`
   *
   * @remarks
   * <br/> - Only applicable for specific use-cases.
   * <br/> - Contact THEO Technologies for more information.
   */
  useId3?: boolean;

  /**
   * The URI from where to retrieve the PodID's as returned from the EABN service from Google.
   */
  retrievePodIdURI?: string;

  /**
   * The endpoint from where to retrieve the server-sent events.
   */
  sseEndpoint?: string;
}

/**
 * Describes how and when the layout of a THEOads ad break should be overridden:
 *  - `'single'`: Override to play all ad breaks using the "single" layout mode.
 *  - `'l-shape'`: Override to play all ad breaks using the "l-shape" layout mode.
 *  - `'double'`: Override to play all ad breaks using the "double" layout mode.
 *  - `'single-if-mobile'`: When on a mobile device, override to play all ad breaks using the "single" layout mode.
 *
 * @category Ads
 * @internal
 */
export enum TheoAdsLayoutOverride {
  SINGLE = 'single',
  LSHAPE = 'l-shape',
  DOUBLE = 'double',
  SINGLE_IF_MOBILE = 'single-if-mobile'
}
