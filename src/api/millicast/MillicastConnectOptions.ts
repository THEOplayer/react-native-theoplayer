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
   * Overrides the duration of time over which bandwidth-estimate-calculations occur in usec. By default, this is 150 msec, increasing this may smooth out transitions a little at the cost of not reacting to changes in the network as fast.
   *
   * @platform android,ios
   */
  bweMonitorDurationUs?: number;

  /**
   * What percentage of the estimated larger bitrate will we increase by when we think the network is good. So if the previous estimate was 1mbps and the new estimate is 10mbps, and `bweRateChangePercentage` is 0.05, then 0.05*10mbps = 0.5mbps, so the new target at the end of the tick will be 1 + 0.5 = 1.5mbps. This value can be reduced to increase more slowly under good conditions.
   *
   * @platform android,ios
   */
  bweRateChangePercentage?: number;

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
   * Enables Discontinuous Transmission (DTX) on the publishing side to send audio only when a user’s voice is detected.
   *
   * @platform web,android,ios
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
   *
   * @remarks
   * Possible values are: `'active'`,`'inactive'`,`'vad'`,`'layers'`,`'viewercount'` and `'updated'`
   */
  events?: string[];

  /**
   * Do not receive media from these source ids.
   *
   * @platform web,android,ios
   *
   * @remarks
   * Maps to the property `excludedSourceId` on iOS and Android.
   */
  excludedSourceIds?: string[];

  /**
   * Sets the minimum and maximum values for the playout delay.
   *
   * @platform web,android,ios
   */
  forcePlayoutDelay?: MillicastForcePlayoutDelay;

  /**
   * Forces video to be sent on downlink when switching from higher quality layers.
   *
   * @platform android,ios
   * @defaultValue false
   */
  forceSmooth?: boolean;

  /**
   * The minimum jitter delay that packets of incoming audio/video streams will experience before being played out. This can be tuned to help with networks with higher latency, but be careful using it as it will introduce this delay.
   *
   * @platform android,ios
   */
  jitterMinimumDelayMs?: number;

  /**
   * Select the simulcast encoding layer and svc layers for the main video track, leave empty for automatic layer selection based on bandwidth estimation.
   *
   * @platform web
   *
   * @remarks
   * See [LayerInfo](https://millicast.github.io/millicast-sdk/global.html#LayerInfo) for more details
   */
  layer?: MillicastLayerInfo;

  /**
   * Sets the maximum bitrate in KBps that the subscriber can receive.
   *
   * @platform android,ios
   */
  maximumBitrate?: number;

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
   * @platform web,android,ios
   *
   * @remarks
   * Maps to the property `multiplexedAudioTrack` on iOS and Android.
   */
  multiplexedAudioTracks?: number;

  /**
   * Options to configure the new RTCPeerConnection.
   *
   * @platform web
   */
  peerConfig?: RTCConfiguration;

  /**
   * A specific source to pin to prioritize its audio and video tracks for playback.
   *
   * @platform web,android,ios
   */
  pinnedSourceId?: string;

  /**
   * The priority of redundant streams that indicates the order in which backup streams should be broadcast in the case of any problems with the primary stream.
   *
   * @platform ios
   */
  priority?: number;

  /**
   * The file path for storing Real-Time Communication (RTC) event logs. Using this option requires having the rights upon the destination file path.
   *
   * @platform android,ios
   * @defaultValue ''
   */
  rtcEventLogOutputPath?: string;

  /**
   * The delay for collecting and reporting statistical information, in milliseconds.
   *
   * @platform android,ios
   * @defaultValue 1000
   */
  statsDelayMs?: number;

  /**
   * A boolean option that determines whether stereo audio playback should be enabled or disabled.
   *
   * @platform android,ios
   * @defaultValue true
   */
  stereo?: boolean;

  /**
   * Duration the Transponder will wait before switching back to a higher layer in msec.
   *
   * @platform android,ios
   */
  upwardsLayerWaitTimeMs?: number;
}

/**
 * @category Millicast
 * @public
 */
export interface MillicastLayerInfo {
  encodingId: string;
  spatialLayerId: number;
  temporalLayerId: number;
  maxSpatialLayerId: number;
  maxTemporalLayerId: number;
}

/**
 * @category Millicast
 * @public
 */
export interface MillicastForcePlayoutDelay {
  /**
   * @remarks
   * Maps to the property `minimum` on iOS and to `minimumDelay` on Android.
   */
  min?: number;

  /**
   * @remarks
   * Maps to the property `maximum` on iOS and to `maximumDelay` on Android.
   */
  max?: number;
}
