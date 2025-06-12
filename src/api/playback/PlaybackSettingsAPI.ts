/**
 * The playback settings for all instances of THEOplayer.
 */
export interface PlaybackSettingsAPI {

  /**
   * The player starts the playback as soon as the first video data is available related to the initial playback position.
   *
   * <ul>
   *     <li>Using this feature will sacrifice the accuracy of the initial seek position
   *     <li>This API is in an experimental stage and may be subject to breaking changes.
   * </ul>
   *
   * @experimental
   *
   * @param {boolean} useFastStartup Whether fast startup is enabled.
   *
   * @platform android
   */
  useFastStartup(useFastStartup: boolean): void;

  /**
   * Sets the lip sync correction delay.
   *
   * This method adjusts the synchronization between audio and video playback for all instances of THEOplayer
   * by applying a specified correction delay.
   *
   * @experimental
   * @since Native THEOplayer SDK v8.1.0.
   * @param {number} correctionMs The correction delay in milliseconds.
   *                              Positive values advance the audio, while negative values delay it.
   *
   * @platform android
   */
  setLipSyncCorrection(correctionMs: number): void;
}
