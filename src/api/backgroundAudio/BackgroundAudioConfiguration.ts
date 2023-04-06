/**
 * Describes the configuration of the background audio feature.
 *
 * @public
 */
export interface BackgroundAudioConfiguration {
  /**
   * Whether background audio should be enabled when transitioning to background.
   *
   * @defaultValue `false`
   */
  readonly enabled?: boolean;

  /**
   * Whether Android's mediaPlaybackService is enabled.
   *
   * The mediaPlaybackService is a MediaBrowserService that provides notifications and background playback.
   * It can be dynamically disabled if the host app already registers a MediaBrowserService that conflicts with this one.
   *
   * @defaultValue `true`
   */
  readonly mediaPlaybackServiceEnabled?: boolean;
}
