/**
 * The response type of the Verizon Media Preplay request, represented by a value from the following list:
 * <br/> - `'vod'`
 * <br/> - `'live'`
 *
 * @public
 */
import type { VerizonMediaResponseVodAds } from "./VerizonMediaResponseVodAds";

export enum VerizonMediaPreplayResponseType {
  VOD = 'vod',
  LIVE = 'live'
}

/**
 * Type of a Verizon Media Preplay response.
 *
 * @public
 */
export type VerizonMediaPreplayResponse = VerizonMediaPreplayVodResponse | VerizonMediaPreplayLiveResponse;

/**
 * Represents a Verizon Media Preplay base response.
 *
 * @public
 */
export interface VerizonMediaPreplayBaseResponse {
  /**
   * The response type of the request.
   */
  type: VerizonMediaPreplayResponseType;

  /**
   * The manifest's URL.
   */
  playURL: string;

  /**
   * The zone prefix for the viewer's session.
   *
   * @remarks
   * <br/> - Use this prefix when submitting playback or API requests for this session.
   *
   * @example
   * E.g. 'https://content-ause2.uplynk.com/'
   */
  prefix: string;

  /**
   * The identifier of the viewer's session.
   */
  sid: string;

  /**
   * The content protection information.
   *
   * @remarks
   * <br/> - Currently, this only contains the Fairplay certificate URL.
   * <br/> - Widevine will default to 'https://content.uplynk.com/wv'.
   * <br/> - Playready will default to 'https://content.uplynk.com/pr'.
   */
  drm?: VerizonMediaResponseDrm;
}

/**
 * Represents a Verizon Media DRM response.
 *
 * @public
 */
export interface VerizonMediaResponseDrm {
  /**
   * The Fairplay certificate URL.
   */
  fairplayCertificateURL?: string;

  /**
   * The Widevine certificate URL.
   */
  widevineLicenseURL?: string;

  /**
   * The PlayReady certificate URL.
   */
  playreadyLicenseURL?: string;
}

/**
 * Represents a Verizon Media Preplay response for VOD assets.
 *
 * @public
 */
export interface VerizonMediaPreplayVodResponse extends VerizonMediaPreplayBaseResponse {
  /**
   * The response type of the request.
   */
  type: VerizonMediaPreplayResponseType.VOD;

  /**
   * The advertisement information.
   */
  ads: VerizonMediaResponseVodAds;

  /**
   * The URL to the interstitial information
   *
   * @remarks
   * <br/> - This file is an XML.
   * <br/> - This parameter reports `null` when ads are not found.
   * <br/> - It should only be used on Apple TV.
   */
  interstitialURL: string | null | undefined;
}

/**
 * Represents a Verizon Media Preplay response for live assets.
 *
 * @public
 */
export interface VerizonMediaPreplayLiveResponse extends VerizonMediaPreplayBaseResponse {
  /**
   * The response type of the request.
   */
  type: VerizonMediaPreplayResponseType.LIVE;
}
