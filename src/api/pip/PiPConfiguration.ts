/**
 * Describes the configuration of the picture-in-picture feature.
 *
 * @public
 */
export interface PiPConfiguration {
  /**
   * Whether Picture in Picture should be allowed to start automatically when transitioning to background.
   *
   * @defaultValue `false`
   */
  readonly startsAutomatically?: boolean;
}
