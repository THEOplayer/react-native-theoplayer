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
   */
  currentBandwidthEstimate(): Promise<number>;
}
