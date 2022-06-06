/**
 * The strategy for aligning HLS discontinuities, represented by a value from the following list:
 * <br/> - `'playlist'`: The first segment after a discontinuity is aligned with the segment's start time according to the HLS playlist,
 *                       i.e. the sum of the `#EXTINF` durations preceding the segment.
 *                       This ensures that the media time is synchronized with the playlist time, allowing for frame-accurate seeking across
 *                       discontinuities. However, if the `#EXTINF` durations from the playlist do not closely match the actual durations
 *                       from the media segments, then this might lead to overlap or gaps at a discontinuity, which can result in glitches or skips
 *                       during playback.
 * <br/> - `'media'`: The first segment after a discontinuity is aligned with the last media frame of the previous discontinuity.
 *                    This ensures that there is no overlap or gap at a discontinuity, resulting in smooth playback.
 *                    However, this may lead to drift between the playlist time and the actual media time, which can result in less accurate seeking.
 * <br/> - `'auto'`: The player aligns discontinuities using the `'playlist'` strategy for VOD and event streams,
 *                   and using the `'media'` strategy for live and DVR streams.
 *                   This is the default.
 *
 * @remarks
 * <br/> - See {@link HlsPlaybackConfiguration.discontinuityAlignment}.
 *
 * @public
 */
export type HlsDiscontinuityAlignment = 'auto' | 'playlist' | 'media';

/**
 * Represents a configuration for controlling playback of an MPEG-DASH stream.
 *
 * @remarks
 * <br/> - Available since v2.82.0.
 *
 * @public
 */
export interface HlsPlaybackConfiguration {
  /**
   * The strategy for aligning HLS discontinuities.
   *
   * @defaultValue `'auto'`
   */
  discontinuityAlignment?: HlsDiscontinuityAlignment;
}
