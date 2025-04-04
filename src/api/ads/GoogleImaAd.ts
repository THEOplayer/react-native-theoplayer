/**
 * Represents a Google IMA creative compliant to the VAST specification.
 *
 * @remarks
 * <br/> - Available since v2.60.0.
 *
 * @public
 */
import type { Ad } from './Ad';

export interface GoogleImaAd extends Ad {
  /**
   * The bitrate of the currently playing creative as listed in the VAST response or 0.
   */
  readonly bitrate: number;

  /**
   * Record of custom parameters for the ad at the time of ad trafficking.
   * Each entry contains a parameter name with associated value.
   *
   * @remarks
   * <br/> - Available when the {@link Ad.readyState} is `'ready'`.
   */
  traffickingParameters: { [parameterKey: string]: string } | undefined;

  /**
   * Return title of the advertisement.
   *
   * @remarks
   * <br/> - Available when the {@link Ad.readyState} is `'ready'`.
   */
  title: string | undefined;

  /**
   * The custom parameters for the ad at the time of ad trafficking, as a string.
   *
   * @remarks
   * <br/> - A parsed version is available as {@link GoogleImaAd.traffickingParameters}.
   * <br/> - Available when the {@link Ad.readyState} is `'ready'`.
   */
  traffickingParametersString: string | undefined;

  /**
   * List of wrapper ad identifiers as specified in the VAST response.
   */
  wrapperAdIds: string[];

  /**
   * List of wrapper ad systems as specified in the VAST response.
   */
  wrapperAdSystems: string[];

  /**
   * List of wrapper creative identifiers.
   *
   * @remarks
   * <br/> - Starts with the first wrapper ad.
   */
  wrapperCreativeIds: string[];

  /**
   * The url of the chosen media file.
   *
   * @remarks
   * <br/> - Available when the {@link Ad.readyState} is `'ready'`.
   */
  mediaUrl: string | undefined;

  /**
   * The content type of the ad.
   *
   * @remarks
   * <br/> - Available when the {@link Ad.readyState} is `'ready'`.
   * <br/> - For linear ads, the content type is only going to be available after the `'adbegin'` event, when the media file is selected.
   */
  contentType: string | undefined;

  /**
   * The identifier of the API framework needed to execute the ad.
   *
   * @remarks
   * <br/> - Available when the {@link Ad.readyState} is `'ready'`.
   * <br/> - This corresponds with the apiFramework specified in vast.
   */
  apiFramework: string | undefined;

  /**
   * The description of the ad from the VAST response.
   *
   * @remarks
   * <br/> - Available for `google-ima` and `google-dai` integrations only.
   * <br/> - Available on Web and Android.
   */
  description: string | undefined;
}
