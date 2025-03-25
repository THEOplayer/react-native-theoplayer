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
   * @remarks Applies to iOS only, impacting behaviour for handling interruptions.
   */
  readonly shouldResumeAfterInterruption?: boolean;

  /**
   * Specify the mode for the native iOS AVAudioSession.
   *
   * @defaultValue `AudioSessionMode.MOVIE_PLAYBACK`
   * @remarks Applies to iOS only, impacting behaviour for handling interruptions.
   */
  readonly audioSessionMode?: AudioSessionMode;
}

export enum AudioSessionMode {
  MOVIE_PLAYBACK = 'moviePlayback',
  SPOKEN_AUDIO = 'spokenAudio'
}
