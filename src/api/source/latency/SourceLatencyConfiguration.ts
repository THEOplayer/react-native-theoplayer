/**
 * The latency configuration for managing the live offset of the player.
 *
 * @remarks
 * <br/> - The player might change the latency configuration based on playback events like stalls.
 *
 * @category Source
 * @public
 */
export interface SourceLatencyConfiguration {
    /**
     * The start of the target live window.
     * If the live offset becomes smaller than this value, the player will slow down in order to increase the latency.
     *
     * @defaultValue 0.66 times the {@link targetOffset}.
     */
    minimumOffset?: number;

    /**
     * The end of the target live window.
     * If the live offset becomes higher than this value, the player will speed up in order to decrease the latency.
     *
     * @defaultValue 1.5 times the {@link targetOffset}.
     */
    maximumOffset?: number;

    /**
     * The live offset that the player will aim for. When correcting the offset by tuning the playbackRate,
     * the player will stop correcting when it reaches this value.
     *
     * @remarks
     * <br/> - This will override the {@link BaseSource.liveOffset} value.
     */
    targetOffset: number;

    /**
     * The live offset at which the player will automatically trigger a live seek.
     *
     * @defaultValue 3 times the {@link targetOffset}.
     */
    forceSeekOffset?: number;

    /**
     * Indicates the minimum playbackRate used to slow down the player.
     *
     * @defaultValue `0.92`
     */
    minimumPlaybackRate?: number;

    /**
     * Indicates the maximum playbackRate used to speed up the player.
     *
     * @defaultValue `1.08`
     */
    maximumPlaybackRate?: number;

    /**
     * The amount of seconds that target latency can be temporarily increased to counteract unstable
     * network conditions.
     *
     * @remarks
     * <br/> - This only works for HESP and THEOlive streams.
     */
    leniency?: number;
}
