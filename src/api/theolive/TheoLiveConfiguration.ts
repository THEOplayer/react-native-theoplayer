/**
 * The configuration THEOlive playback.
 *
 * @public
 */
export interface TheoLiveConfiguration {
  /**
   * An id used to report usage analytics, if not explicitly given a random UUID is used.
   *
   * @remarks
   * <br/> - Available on Web and Android only.
   */
  readonly externalSessionId?: string;

  /**
   * Whether this player should fallback or not when it has a fallback configured.
   *
   * @remarks
   * <br/> - Available on Web only.
   */
  readonly fallbackEnabled?: boolean;

  /**
   * An optional header that can be passed during discovery.
   *
   * @remarks
   * <br/> - Available on Web only.
   */
  readonly discoveryHeader?: string;

  /**
   * Whether THEOlive analytics should be disabled or not.
   *
   * @remarks
   * <br/> - Available on Android only.
   *
   * @defaultValue `false`
   */
  readonly analyticsDisabled?: boolean;
}
