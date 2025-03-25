/**
 * The additional options that can be configured when connecting to a {@link https://dolby.io/products/real-time-streaming/ | Millicast} live stream.
 *
 * @category Source
 * @category Millicast
 * @public
 *
 * @remarks
 * For additional addition information on each underlying SDK, see the docs:
 * - Web: [Millicast Web SDK](https://millicast.github.io/millicast-sdk/View.html#connect)
 * - iOS: [Millicast iOS SDK](https://millicast.github.io/doc/latest/apple/documentation/millicastsdk/mcclientoptions/)
 * - Android: [Millicast Android SDK](https://millicast.github.io/doc/latest/android/android/com.millicast.subscribers/-option/index.html)
 */
export interface MillicastConnectOptions {
  /**
   * True to modify SDP for supporting absolute capture time header extension. Otherwise, False.
   *
   * @platform web
   */
  absCaptureTime?: boolean;

  /**
   * A boolean option that determines whether audio playback should be completely disabled. Disabling unnecessary audio helps reduce audio-to-video synchronization delays.
   *
   * @platform ios,android,web
   * @defaultValue false
   */
  disableAudio?: boolean;

  /**
   * Disable the opportunity to receive video stream.
   *
   * @platform web
   * @defaultValue false
   */
  disableVideo?: boolean;

  /**
   * Enable the DRM protected stream playback.
   *
   * @platform web
   * @defaultValue false
   */
  drm?: boolean;

  /**
   * True to modify SDP for supporting dtx in opus. Otherwise, False.
   *
   * @platform web
   * @defaultValue false
   */
  dtx?: boolean;

  /**
   * Enable DRM, default is false.
   *
   * @platform web
   */
  enableDRM?: boolean;

  /**
   * Override which events will be delivered by the server.
   *
   * @platform web
   * @remarks
   * Possible values are: `'active'`,`'inactive'`,`'vad'`,`'layers'`,`'viewercount'` and `'updated'`
   */
  events?: string[];

  /**
   * Do not receive media from these source ids.
   *
   * @platform web
   */
  excludedSourceIds?: string[];

  /**
   * Ask the server to use the playout delay header extension.
   *
   * @platform web
   */
  forcePlayoutDelay?: object;

  /**
   * Select the simulcast encoding layer and svc layers for the main video track, leave empty for automatic layer selection based on bandwidth estimation.
   *
   * @platform web
   * @remarks
   * See [LayerInfo](https://millicast.github.io/millicast-sdk/global.html#LayerInfo) for more details
   */
  layer?: MillicastLayerInfo

  /**
   * Enable metadata extraction if stream is compatible.
   *
   * @platform web
   * @defaultValue false
   */
  metadata?: boolean;

  /**
   * Number of audio tracks to receive VAD multiplexed audio for secondary sources.
   *
   * @platform web
   */
  multiplexedAudioTracks?: number;

  /**
   * Options to configure the new RTCPeerConnection.
   *
   * @platform web
   */
  peerConfig?: RTCConfiguration;

  /**
   * ID of the main source that will be received by the default MediaStream.
   *
   * @platform web
   */
  pinnedSourceId?: string;
}

export interface MillicastLayerInfo {
  encodingId: string;
  spatialLayerId: number;
  temporalLayerId: number;
  maxSpatialLayerId: number;
  maxTemporalLayerId: number;
}
