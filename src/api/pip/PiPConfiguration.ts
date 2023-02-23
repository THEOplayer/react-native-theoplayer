/**
 * Describes the configuration of the picture-in-picture feature.
 *
 * @public
 */
export interface PiPConfiguration {
  /**
   * Whether the presentation mode should be retained on source changes.
   *
   * @defaultValue `false`
   */
  retainPresentationModeOnSourceChange?: boolean;

  /**
   * Whether Picture in Picture should be allowed to start automatically when transitioning to background if the player's current presentation mode
   * is `inline`.
   *
   * @defaultValue `false`
   */
  canStartPictureInPictureAutomaticallyFromInline?: boolean;
}
