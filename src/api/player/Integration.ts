/**
 * Describes optional playback overrides supplied by a player facade integration.
 *
 * @remarks
 * <br/> - Requires {@link PlayerConfiguration.usePlayerFacade} when creating the player.
 * <br/> - Registration takes place on the Web native handle or through the Android native API, not on the React Native player API.
 * <br/> - Omitted hooks and nullish getter results delegate to the content player.
 * <br/> - The integration owns playback synchronization and must dispatch events when its public state changes.
 *
 * @category Player
 * @platform web,android
 * @public
 */
export interface Integration {
  /**
   * Returns the current playback time, in seconds.
   *
   * @returns A finite, non-negative time, or `null` or `undefined` to use the content player's time.
   * Invalid times also fall back to the content player.
   */
  getCurrentTime?(): number | null | undefined;

  /**
   * Requests a seek to the given playback time.
   *
   * @param currentTime - The requested time, in seconds.
   * @returns `true` if handled, or `false` to seek the content player instead.
   */
  setCurrentTime?(currentTime: number): boolean;

  /**
   * Requests playback to start or resume.
   *
   * @returns `true` if handled, or `false` to play the content player instead.
   */
  play?(): boolean;

  /**
   * Requests playback to pause.
   *
   * @returns `true` if handled, or `false` to pause the content player instead.
   */
  pause?(): boolean;

  /**
   * Returns whether playback is paused.
   *
   * @returns The paused state, or `null` or `undefined` to use the content player's state.
   */
  isPaused?(): boolean | null | undefined;

  /**
   * Returns whether a seek is in progress.
   *
   * @returns The seeking state, or `null` or `undefined` to use the content player's state.
   */
  isSeeking?(): boolean | null | undefined;

  /**
   * Returns the playback duration, in seconds.
   *
   * @returns The duration, or `null` or `undefined` to use the content player's duration.
   * `Infinity` and `NaN` are preserved for live or unknown durations.
   */
  getDuration?(): number | null | undefined;

  /**
   * Returns whether audio is muted.
   *
   * @returns The muted state, or `null` or `undefined` to use the content player's state.
   */
  getMuted?(): boolean | null | undefined;

  /**
   * Requests a change to the muted state.
   *
   * @param muted - Whether audio should be muted.
   * @returns `true` if handled, or `false` to update the content player instead.
   */
  setMuted?(muted: boolean): boolean;

  /**
   * Returns the audio volume.
   *
   * @returns A volume between `0` and `1`, or `null` or `undefined` to use the content player's volume.
   */
  getVolume?(): number | null | undefined;

  /**
   * Requests a change to the audio volume.
   *
   * @param volume - The requested volume, between `0` and `1`.
   * @returns `true` if handled, or `false` to update the content player instead.
   */
  setVolume?(volume: number): boolean;
}
