/**
 * The API for player metrics.
 *
 * @category Player
 * @public
 */
export interface MetricsAPI {
  /**
   * The bandwidth, in bits per second, that the player estimates is currently available.
   * This is the value used to make adaptive bitrate (ABR) decisions.
   *
   * @remarks
   * <br/> - This value is poll-based: read it on demand, as there is no change event.
   * <br/> - Resolves to `0` when no estimate is available yet (e.g. before playback or after a reset).
   *   A value of `0` means "not available/estimated", not literally zero bandwidth.
   * <br/> - On Android and Web the estimate is reported for regular adaptive streams (HLS, DASH, ...).
   * <br/> - On iOS/tvOS the estimate is only populated for THEOlive/HESP streams; it stays `0` for other playback (HLS, MP4).
   */
  currentBandwidthEstimate(): Promise<number>;
}
