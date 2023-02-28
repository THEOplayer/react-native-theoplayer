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
  startsAutomatically?: boolean;

  /**
   * Whether the Picture in Picture view shows controls to seek in the stream.
   *
   * @defaultValue `false`
   */
  requiresLinearPlayback?: boolean;
}
