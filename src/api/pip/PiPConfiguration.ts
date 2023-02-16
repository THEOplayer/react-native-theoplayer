/**
 * Describes the configuration of the picture-in-picture feature.
 *
 * @public
 */
export interface PiPConfiguration {
    /**
     * The maximum percentage of the original player position that should be visible to enable picture-in-picture automatically.
     *
     * @remarks
     * <br/> - If not configured, picture-in-picture can only be activated by calling {@link Presentation.requestMode} with the `'picture-in-picture'` argument.
     *
     * @defaultValue `undefined`
     */
    // visibility?: number | undefined;

    /**
     * Whether the presentation mode should be retained on source changes.
     *
     * @defaultValue `false`
     */
    retainPresentationModeOnSourceChange?: boolean;

    /**
     * Whether Picture in Picture should be allowed to start automatically when transitioning to background when the receiver’s content is embedded inline. Default is NO.
     *
     * @defaultValue `false`
     */
    canStartPictureInPictureAutomaticallyFromInline?: boolean;
}
