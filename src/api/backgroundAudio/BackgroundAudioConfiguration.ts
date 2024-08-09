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
   * Whether background audio should be resumed after an interruption (e.g. incoming call ended).
   *
   * @defaultValue `false`
   * @remark Applies to iOS only, impacting behaviour for handling interruptions while on the lockscreen.
   */
  readonly shouldResumeAfterInterruption?: boolean;
}
