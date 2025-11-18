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
   * Whether background audio should be resumed after an interruption on iOS (e.g. incoming call).
   *
   * @defaultValue `false`
   *
   * @platform ios
   */
  readonly shouldResumeAfterInterruption?: boolean;

  /**
   * Specify the mode for the native iOS AVAudioSession.
   *
   * @defaultValue `AudioSessionMode.MOVIE_PLAYBACK`
   *
   * @platform ios
   */
  readonly audioSessionMode?: AudioSessionMode;

  /**
   * Whether the player should stop play-out when the app goes to background.
   * This differs from `enabled` which allows play-out to either continue in background, or be paused.
   * Note that when the app comes back to foreground, a new source would have to be set.
   *
   * @defaultValue `false`
   */
  readonly stopOnBackground?: boolean;
}

export enum AudioSessionMode {
  MOVIE_PLAYBACK = 'moviePlayback',
  SPOKEN_AUDIO = 'spokenAudio'
}
