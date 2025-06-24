/**
 * Latency metrics for HESP pipeline
 *
 * @category TheoLive
 * @public
 */

export interface HespLatencies {
  /**
   * The latency introduced by processing the ingested stream in the engine on the server.
   */
  engineLatency?: number;

  /**
   * The latency introduced by distributing the processed frames towards the clients.
   */
  distributionLatency?: number;

  /**
   * The latency introduced by the player to process, buffer and display the downloaded frames.
   */
  playerLatency?: number;

  /**
   * The total latency introduced by the theolive pipeline: from frame ingested till displayed on screen.
   */
  theoliveLatency?: number
}

/**
 * The API for THEOlive streaming.
 *
 * @category TheoLive
 * @public
 */
export interface TheoLiveAPI {
  /**
   * The latency measured for the playing THEOlive channel
   */
  currentLatency(): Promise<number>;

  /**
   * A set of latency metrics, measured at different parts of the HESP pipeline.
   */
  latencies(): Promise<HespLatencies>;

}
