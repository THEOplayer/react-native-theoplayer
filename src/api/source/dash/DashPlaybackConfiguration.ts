/**
 * The strategy for period switches (see {@link DashPlaybackConfiguration.useSeamlessPeriodSwitch}), represented by a value from the following list:
 * <br/> - `'auto'`: The player uses seamless switches if the platform supports it, and hard switches otherwise.
 *                   This is the default.
 * <br/> - `'never'`: The player never uses a seamless switch, and always uses a hard switch.
 *                    Use this if you notice that the player is attempting but failing to preload the next period on the current platform.
 * <br/> - `'always'`: The player always uses a seamless switch, and never uses a hard switch.
 *                     Use this if you notice that the player never preloads the next period, even though you know that the current platform
 *                     should support it.
 *
 * @public
 */
export type SeamlessPeriodSwitchStrategy = 'auto' | 'always' | 'never';

/**
 * Represents a configuration for controlling playback of an MPEG-DASH stream.
 *
 * @remarks
 * <br/> - Available since v2.79.0.
 *
 * @public
 */
export interface DashPlaybackConfiguration {
  /**
   * Whether to seamlessly switch between DASH periods.
   *
   * @remarks
   * The player supports two strategies for handling a switch between two periods in an MPEG-DASH stream:
   * <br/> - <strong>Seamless</strong>: Once the player is done buffering the current period, it immediately starts buffering the next period.
   *         This requires that the current period and the next period have compatible codecs and content protection, or that the platform
   *         supports buffering different codecs in a single player. Because the next period is preloaded ahead of time, this makes the actual
   *         switch between periods (almost) completely seamless.
   * <br/> - <strong>Hard</strong>: The player waits until playback reaches the end of the current period before buffering and playing the next
   *         period. Because the buffering is not done ahead of time, this may result in a noticeable stall at the start of the next period.
   *         However, this strategy does not require any special platform support, so it works on any platform or device.
   *
   * By default, the player will automatically choose between a seamless or a hard period switch based on the codecs and content protection of
   * the two periods, and the support information reported by the platform. However, if you notice that the player makes an incorrect decision
   * on certain streams or platforms, you can use this option to override its behavior as a stopgap solution. (You should still report this
   * problem to THEOplayer support, so we can improve the player's default behavior and you can remove this override.)
   *
   * @defaultValue `'auto'`
   */
  useSeamlessPeriodSwitch?: SeamlessPeriodSwitchStrategy;
}
