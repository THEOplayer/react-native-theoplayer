/**
 * The additional options that can be configured when connecting to a {@link https://dolby.io/products/real-time-streaming/ | Millicast} live stream.
 *
 * @category Source
 * @category Millicast
 * @public
 */
export interface MillicastConnectOptions {
  /**
   * A boolean option that determines whether audio playback should be completely disabled. Disabling unnecessary audio helps reduce audio-to-video synchronization delays.
   */
  disableAudio: boolean;
}
