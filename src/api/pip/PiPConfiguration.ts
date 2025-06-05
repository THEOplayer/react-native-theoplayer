/**
 * Describes the configuration of the picture-in-picture feature.
 *
 * @public
 */
export interface PiPConfiguration {
  /**
   * Whether Picture in Picture should be allowed to start automatically from inline, when transitioning to background.
   *
   * @defaultValue `false`
   */
  readonly startsAutomatically?: boolean;

  /**
   * Whether Picture in Picture should reparent player to the root.
   *
   * @defaultValue `true`
   * @remark: Only configurable for Android.
   */
  readonly reparentPip?: boolean;

  /**
   * Whether Picture in Picture should remain active when setting a new (non-undefined) source.
   *
   * @defaultValue `false`
   * @remark: Only configurable for iOS.
   */
  readonly retainPipOnSourceChange?: boolean;
}
