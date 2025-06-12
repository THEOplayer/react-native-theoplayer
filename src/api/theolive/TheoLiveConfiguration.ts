/**
 * The configuration THEOlive playback.
 *
 * @public
 */
export interface TheoLiveConfiguration {
  /**
   * An id used to report usage analytics, if not explicitly given a random UUID is used.
   *
   * @platform web,android
   */
  readonly externalSessionId?: string;

  /**
   * Whether this player should fallback or not when it has a fallback configured.
   *
   * @platform web
   */
  readonly fallbackEnabled?: boolean;

  /**
   * An optional header that can be passed during discovery.
   *
   * @platform web
   */
  readonly discoveryHeader?: string;

  /**
   * Whether THEOlive analytics should be disabled or not.
   *
   * @platform android
   *
   * @defaultValue `false`
   */
  readonly analyticsDisabled?: boolean;
}
