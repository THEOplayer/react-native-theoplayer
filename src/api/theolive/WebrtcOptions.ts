
/**
 * Webrtc playout delay configuration.
 * 
 * This is used to configure the playout delay for a Millicast Source. This hints Webrtc 
 * to increase the jitter buffer size.
 *
 * @category THEOlive
 * @remark This is a hint, and factors like network jitter and audio/video sync latency affect the actual delay applied.
 * @public
 */
export interface WebrtcPlayoutDelay {
  minimum: number;
  maximum: number;
}

/**
 * WebRTC configuration for a THEOlive Millicast source.
 *
 * @category THEOlive
 * @public
 */
export interface WebrtcOptions {
  /**
   * Webrtc playout delay configuration for the Webrtc media.
   */
  playoutDelayMs?: WebrtcPlayoutDelay;
}