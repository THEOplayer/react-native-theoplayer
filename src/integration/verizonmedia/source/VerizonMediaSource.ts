import type { BaseSource } from 'react-native-theoplayer';
import type { VerizonMediaAssetType } from '../VerizonMediaAssetType';

export type VERIZON_MEDIA_ID = 'verizon-media';

/**
 * Represents a media resource which is found on the Verizon Media Platform.
 *
 * @public
 */
export interface VerizonMediaSource extends BaseSource {
  /**
   * The integration ID of the source.
   */
  integration: VERIZON_MEDIA_ID;

  /**
   * One or multiple asset identifiers for the source.
   *
   * @remarks
   * <br/> - The order of a list of asset identifiers is the order their corresponding assets will be played in.
   */
  id: VerizonMediaAssetId | VerizonMediaAssetId[] | VerizonMediaExternalId;

  /**
   * The prefix to use for Verizon Media Preplay API and Asset Info API requests.
   *
   * @defaultValue `'https://content.uplynk.com'`
   */
  prefix?: string;

  /**
   * The query string parameters added to Verizon Media Preplay requests.
   *
   * @remarks
   * Each entry contains the parameter name with associated value.
   *
   * Valid parameters:
   * <br/> - {@link https://docs.vdms.com/video/#Develop/Preplayv2.htm | Uplynk Preplay parameters}
   * <br/> - {@link https://docs.vdms.com/video/#AdIntegration/AOL-One-Video.htm | Uplynk ads with AOL One Video parameters}
   * <br/> - {@link https://docs.vdms.com/video/#AdIntegration/DoubleClick.htm | Uplynk ads with Doubleclick parameters}
   * <br/> - {@link https://docs.vdms.com/video/#AdIntegration/Freewheel.htm | Uplynk ads with FreeWheel parameters}
   */
  preplayParameters?: Record<string, string> | Array<[string, string]>;

  /**
   * The query string parameters added to Verizon Media playback URL requests.
   *
   * @remarks
   * Each entry contains the parameter name with associated value.
   *
   * Valid parameters:
   * <br/> - {@link https://docs.vdms.com/video/#Setup/Customizing-Playback.htm | Uplynk Playback Customization parameters}
   * <br/> - {@link https://docs.vdms.com/video/#Setup/Playback-URLs.htm | Uplynk Tokens parameters}
   */
  playbackUrlParameters?: Record<string, string>;

  /**
   * The asset content type of the source.
   *
   * @defaultValue `'asset'`
   */
  assetType?: VerizonMediaAssetType;

  /**
   * Whether the assets of the source are content protected.
   *
   * @defaultValue `false`
   */
  contentProtected?: boolean;

  /**
   * The Ping API feature configuration of the source.
   *
   * @remarks
   * <br/> - A configuration with all features disabled will prevent Ping requests being sent.
   *
   * @defaultValue
   * A configuration with all features `false` except for `linearAdData`, which will be `true` if {@link VerizonMediaSource.assetType} is
   * `'channel'` or `'event'` and `false` otherwise.
   */
  ping?: VerizonMediaPingConfiguration;

  /**
   * Whether asset info will be fetched from the Verizon Media Asset Info API and exposed on the player API.
   *
   * @remarks
   * <br/> - This feature is only available if {@link VerizonMediaSource.assetType} is `'asset'`
   *
   * @defaultValue `true` if {@link VerizonMediaSource.assetType} is `'asset'` and `false` otherwise
   */
  assetInfo?: boolean;
}

/**
 * Represents a unique asset identifier for a Verizon Media asset.
 *
 * @remarks
 * <br/> - This asset identifier determines a unique asset on the Verizon Media Platform.
 *
 * @public
 */
export type VerizonMediaAssetId = string;

/**
 * Represents a combination of user identifier and one or more external identifiers for Verizon Media assets.
 *
 * @remarks
 * <br/> - Each combination of the user identifier and external identifier determines a unique asset on the Verizon Media Platform.
 *
 * @public
 */
export interface VerizonMediaExternalId {
  /**
   * The user identifier for the asset(s).
   */
  userId: string;

  /**
   * The external identifier(s) for the asset(s).
   */
  externalId: string | string[];
}

/**
 * Describes the configuration of Verizon Media Ping features.
 *
 * @public
 */
export interface VerizonMediaPingConfiguration {
  /**
   * Whether to increase the accuracy of ad events by passing the current playback time in Ping requests.
   *
   * @remarks
   * <br/> - Only available when {@link VerizonMediaSource.assetType} is `'asset'`.
   *
   * @defaultValue `false`
   *
   */
  adImpressions?: boolean;

  /**
   * Whether to enable FreeWheel's Video View by Callback feature to send content impressions to the FreeWheel server.
   *
   * @remarks
   * <br/> - Only available when {@link VerizonMediaSource.assetType} is `'asset'`.
   *
   * @defaultValue `false`
   */
  freeWheelVideoViews?: boolean;

  /**
   * Whether to request information about upcoming ad breaks in the Ping responses.
   *
   * @remarks
   * <br/> - Only available when {@link VerizonMediaSource.assetType} is `'event'` or `'channel'`.
   *
   * @defaultValue `true` if {@link VerizonMediaSource.assetType} is `'event'` or `'channel'`, otherwise `false`.
   */
  linearAdData?: boolean;
}
