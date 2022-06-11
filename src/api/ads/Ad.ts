/**
 * Represents a VAST creative. It is either a linear or non-linear ad.
 *
 * @public
 */
import type { AdBreak } from './AdBreak';
import type { CompanionAd } from 'theoplayer';

export interface Ad {
  /**
   * The source ad server information included in the ad response.
   *
   * @remarks
   * <br/> - Available when the {@link Ad.readyState} is `'ready'`.
   */
  adSystem: string | undefined;

  /**
   * The integration of the ad, represented by a value from the following list:
   * <br/> - `'theo'`
   * <br/> - `'google-ima'`
   * <br/> - `'google-dai'`
   * <br/> - `'freewheel'`
   *
   * @defaultValue `'theo'`
   */
  integration?: string;

  /**
   * The type of the ad, represented by a value from the following list:
   * <br/> - `'linear'`
   * <br/> - `'nonlinear'`
   */
  type: string;

  /**
   * The identifier of the creative.
   *
   * @remarks
   * <br/> - Available when the {@link Ad.readyState} is `'ready'`.
   */
  id: string | undefined;

  /**
   * The ready state of the ad.
   */
  readyState?: AdReadyState;

  /**
   * The ad break which the ad is part of.
   *
   * @remarks
   * <br/> - Available for VAST-ads.
   */
  adBreak: AdBreak;

  /**
   * The duration of the ad, in seconds.
   *
   * @remarks
   * <br/> - Available when the {@link Ad.readyState} is `'ready'`.
   * <br/> - Only available for LinearAd.
   */
  duration?: number;

  /**
   * The width of the ad, in pixels.
   *
   * @remarks
   * <br/> - Available when the {@link Ad.readyState} is `'ready'`.
   */
  width: number | undefined;

  /**
   * The height of the ad.
   *
   * @remarks
   * <br/> - Available when the {@link Ad.readyState} is `'ready'`.
   */
  height: number | undefined;

  /**
   * The URI of the the ad content.
   *
   * @remarks
   * <br/> - Available when the {@link Ad.readyState} is `'ready'`.
   */
  resourceURI?: string;

  /**
   * The website of the advertisement.
   *
   * @remarks
   * <br/> - Available when the {@link Ad.readyState} is `'ready'`.
   */
  clickThrough: string | undefined;

  /**
   * List of companions which can be displayed outside the player.
   *
   * @remarks
   * <br/> - Available when the {@link Ad.readyState} is `'ready'`.
   * <br/> - Only supported for `'theo'` and `'google-dai'`.
   */
  companions: CompanionAd[];

  /**
   * Offset after which the ad break may be skipped, in seconds.
   *
   * @remarks
   * <br/> - Available when the {@link Ad.readyState} is `'ready'`.
   * <br/> - If the offset is -1, the ad is unskippable.
   * <br/> - If the offset is 0, the ad is immediately skippable.
   * <br/> - Otherwise it must be a positive number indicating the offset.
   */
  skipOffset: number | undefined;

  /**
   * The identifier of the selected creative for the ad.
   *
   * @remarks
   * <br/> - Available when the {@link Ad.readyState} is `'ready'`.
   */
  creativeId: string | undefined;

  /**
   * The list of universal ad ID information of the selected creative for the ad.
   *
   * @remarks
   * <br/> - Only supported for `'theo'` and `'google-ima'`.
   */
  universalAdIds: UniversalAdId[];
}

/**
 * The ad readiness state, represented by a value from the following list:
 * <br/> - `'none'`: The ad not loaded state.
 * <br/> - `'ready'`: The ad loaded state.
 *
 * @remarks
 * <br/> - An ad is loaded when the ad resource (e.g. VAST file) is downloaded.
 * <br/> - another remark
 *
 * @public
 */
export type AdReadyState = 'none' | 'ready';

/**
 * Represents the information regarding the universal identifier of an ad.
 *
 * @public
 */
export interface UniversalAdId {
  /**
   * The registry associated with cataloging the UniversalAdId of the selected creative for the ad.
   *
   * @remarks
   * <br/> - Returns the registry value, or 'unknown' if unavailable.
   */
  adIdRegistry: string;

  /**
   * The UniversalAdId of the selected creative for the ad.
   *
   * @remarks
   * <br/> - Returns the id value or 'unknown' if unavailable.
   */
  adIdValue: string;
}

/**
 * Represents a non-linear ad in the VAST specification.
 *
 * @public
 */
export interface NonLinearAd extends Ad {
  /**
   * The alternative description for the ad.
   *
   * @remarks
   * <br/> - Available when the {@link Ad.readyState} is `'ready'`.
   */
  altText: string | undefined;

  /**
   * The website of the ad.
   *
   * @remarks
   * <br/> - Available when the {@link Ad.readyState} is `'ready'`.
   */
  clickThrough: string | undefined;

  /**
   * The HTML-string with the content of the ad.
   *
   * @remarks
   * <br/> - Available when the {@link Ad.readyState} is `'ready'`.
   */
  contentHTML: string | undefined;
}

/**
 * The delivery type of the ad content file, represented by a value from the following list:
 * <br/> - `'progressive'`: Delivered through progressive download protocols (e.g. HTTP).
 * <br/> - `'streaming'`: Delivered through streaming download protocols.
 *
 * @remarks
 * <br/> - `'streaming'` is currently not supported.
 *
 * @public
 */
export type DeliveryType = 'progressive' | 'streaming';

/**
 * Represents metadata of an media file with ad content.
 *
 * @remarks
 * <br/> - This metadata is retrieved from the VAST file.
 *
 * @public
 */
export interface MediaFile {
  /**
   * The delivery type of the video file.
   */
  delivery: DeliveryType;

  /**
   * The MIME type for the file container.
   */
  type: string;

  /**
   * The native width of the video file, in pixels.
   */
  width: number;

  /**
   * The native height of the video file, in pixels.
   */
  height: number;

  /**
   * The URI of the VAST content.
   */
  contentURL: string;
}

/**
 * Represents a linear ad in the VAST specification.
 *
 * @public
 */
export interface LinearAd extends Ad {
  /**
   * The duration of the ad, in seconds.
   *
   * @remarks
   * <br/> - Available when the {@link Ad.readyState} is `'ready'`.
   */
  duration: number;

  /**
   * List of media files which contain metadata about ad video files.
   */
  mediaFiles: MediaFile[];
}
