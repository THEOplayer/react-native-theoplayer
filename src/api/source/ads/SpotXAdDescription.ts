import type { AdDescription } from "./Ads";

/**
 * Represents a geographical location.
 *
 * @public
 */
export interface Geo {
  /**
   * The latitude of this location.
   */
  readonly lat: number;

  /**
   * The longitude of this location.
   */
  readonly lon: number;
}

/**
 * A record of SpotX query string parameters.
 * Each entry contains the parameter name with associated value.
 *
 * @public
 */
export interface SpotxData {
  [key: string]: string | number | boolean | string[] | Geo;
}

/**
 * A record of SpotX query string parameters which can be a nested structure.
 * Each entry contains the parameter name with associated value.
 *
 * @public
 */
export interface SpotxQueryParameter {
  [key: string]: string | number | boolean | string[] | Geo | SpotxData | SpotxData[];
}

/**
 * Describes a SpotX ad break request.
 *
 * @remarks
 * <br/> - Available since v2.13.0.
 *
 * @example
 * ```
 * {
 *     integration: 'spotx',
 *     id: 123456,
 *     cacheBuster: true,
 *     app: {
 *         bundle: 'com.exampleapps.example',
 *         name: 'My CTV App'
 *     },
 *     device: {
 *         ifa: '38400000-8cf0-11bd-b23e-10b96e40000d',
 *         ua: 'Mozilla/5.0 (iPhone; CPU iPhone OS 10_3 like Mac OS X) AppleWebKit/602.1.50 (KHTML, like Gecko) CriOS/56.0.2924.75 Mobile/14E5239e Safari/602.1',
 *         geo: {
 *             lat: -24.378528,
 *             lon: -128.325119
 *         },
 *         dnt: 1,
 *         lmt: 1,
 *     },
 *     custom: {
 *         category: ['category1', 'category2'],
 *         somekey: 'somevalue'
 *     }
 *     user: {
 *         yob: 1984,
 *         gender: 'm'
 *     }
 * }
 * ```
 *
 * @public
 */
export interface SpotXAdDescription extends AdDescription {
  /**
   * The identifier of the ad break requested from SpotX.
   */
  id: number | string;

  /**
   * The maximum duration of the ad, in seconds.
   *
   * @defaultValue No maximum duration.
   */
  maximumAdDuration?: number | string;

  /**
   * The URL of the content page.
   */
  contentPageUrl?: string;

  /**
   * The IP address of the viewer.
   */
  ipAddress?: string;

  /**
   * Whether the ad break request should contain a cache buster.
   *
   * @remarks
   * <br/> - A cache buster adds a query parameter 'cb' with a random value to circumvent browser caching mechanisms.
   */
  cacheBuster?: boolean;

  /**
   * A source URL which contains the location of ad resources to be scheduled.
   *
   * @remarks
   * <br/> - This will override the generated URL.
   */
  sources?: string;

  /**
   * A record of query string parameters added to the SpotX ad break request.
   * Each entry contains the parameter name with associated value.
   *
   * @remarks
   * <br/> - Available since v2.38.0.
   */
  queryParameters?: SpotxQueryParameter;
}
