/**
 * Describes the configuration of advertisement.
 *
 * @public
 */
import type { GoogleImaConfiguration } from './GoogleImaConfiguration';

export interface AdsConfiguration {
  /**
   * Allows configuring which mime types are allowed during ad playback.
   *
   * @remarks
   * <br/> - This feature is only available for Google IMA.
   * <br/> - If set to an array, all ads with another mime types will be ignored.
   * <br/> - If set to `undefined` the ad system will pick media based on the browser's capabilities.
   *
   * @defaultValue `undefined`
   */
  allowedMimeTypes?: string[];

  /**
   * Whether an advertisement UI is shown.
   *
   * @defaultValue `true`
   */
  uiEnabled?: boolean;

  /**
   * Whether media files of mid- and postrolls are preloaded.
   *
   * @remarks
   * <br/> - This feature is only available for Google IMA.
   *
   * @defaultValue `'midroll-and-postroll'`
   */
  preload?: AdPreloadType;

  /**
   * The iframe policy for VPAID ads.
   *
   * @remarks
   * <br/> - This feature is only available for Google IMA and SpotX.
   *
   * @defaultValue `'enabled'`
   */
  vpaidMode?: VPAIDMode;

  /**
   * The Google IMA configuration.
   *
   * @internal
   */
  googleImaConfiguration?: GoogleImaConfiguration;
}

/**
 * The ad preloading strategy, represented by a value from the following list:
 * <br/> - `'none'`: Ads are not preloaded.
 * <br/> - `'midroll-and-postroll'`: Mid- and postrolls are preloaded.
 *
 * @remarks
 * <br/> - For Google IMA, preloading starts 4 seconds before ad playback.
 *
 * @public
 */
export type AdPreloadType = 'none' | 'midroll-and-postroll';

/**
 * The iframe policies for VPAID ads, represented by a value from the following list:
 * <br/> - `'enabled'`: Ads will load in a cross domain iframe. This disables access to the site via JavaScript. Ads that require a friendly iframe will fail to play.
 * <br/> - `'insecure'`: Ads will load in a friendly iframe. This allows access to the site via JavaScript.
 * <br/> - `'disabled'`: Ads will error when requested.
 *
 * @public
 */
export type VPAIDMode = 'enabled' | 'insecure' | 'disabled';
