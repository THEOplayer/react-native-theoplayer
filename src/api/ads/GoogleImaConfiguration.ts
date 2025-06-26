/**
 * Describes the configuration of Google IMA.
 *
 * @category Ads
 * @internal
 */
export interface GoogleImaConfiguration {
  /**
   * Publisher Provided Identification (PPID) sent with ads request.
   */
  ppid?: string;

  /**
   * Specifies maximum number of redirects after which subsequent redirects will
   * be denied, and the ad load aborted. The number of redirects directly affects
   * latency and thus user experience. This applies to all VAST wrapper ads. If
   * the number of redirects exceeds |maxRedirects|, the ad request will fail with
   * error code 302.
   *
   * @defaultValue `4`
   */
  maxRedirects?: number;

  /**
   * Feature flags and their states. Used to control experimental features.
   */
  featureFlags?: { [flag: string]: string };

  /**
   * Specifies whether to automatically play VMAP and ad rules ad breaks.
   *
   * @defaultValue `true`
   */
  autoPlayAdBreaks?: boolean;

  /**
   * The session ID to identify a single user session. This should be a UUID. It
   * is used exclusively for frequency capping across the user session.
   */
  sessionID?: string;

  /**
   * Toggles debug mode which will output detailed log information to the console.
   * Debug mode should be disabled in Release and will display a watermark when
   * enabled.
   *
   * @defaultValue `false`
   */
  enableDebugMode?: boolean;

  /**
   * Maximum recommended bitrate. The value is in kbit/s. SDK will pick media with bitrate below the specified max,
   * or the closest bitrate if there is no media with smaller bitrate found. Default value -1, means the bitrate will
   * be selected by the SDK.
   *
   * @defaultValue `-1`
   */
  bitrate?: number;

  /**
   * The amount of time that the SDK will wait before moving onto the next ad for loading.
   * This value will be specified in seconds.
   */
  adLoadTimeout?: number;


  /**
   * Whether to focus on the skip button when the skippable ad can be skipped on Android TV. This is a no-op on non-Android TV devices.
   * 
   * @defaultValue `false`
   * 
   * @platform android
   */
  focusSkipButtonWhenAvailable?: boolean
}
