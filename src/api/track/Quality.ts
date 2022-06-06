/**
 * Represents a quality of a media track.
 *
 * @public
 */
export interface Quality {
  /**
   * The average bandwidth of the quality.
   */
  readonly averageBandwidth?: number;

  /**
   * The required bandwidth for the quality.
   */
  readonly bandwidth: number;

  /**
   * The codecs of the quality.
   *
   * @remarks
   * <br/> - These are represented as a string containing the codecs as defined by the manifest.
   */
  readonly codecs: string;

  /**
   * The identifier for this quality. This identifier is tied to the stream's internal representation. It may be empty. For a unique id, use {@link Quality.uid}.
   */
  readonly id: string;

  /**
   * The unique identifier for this quality.
   */
  readonly uid: number;

  /**
   * The name of the quality.
   */
  readonly name: string;

  /**
   * The label of the quality.
   */
  label: string;

  /**
   * Whether the quality is available.
   *
   * @remarks
   * <br/> - A quality can be unavailable due to a DRM restriction (e.g. HDCP).
   */
  readonly available: boolean;
}

/**
 * Represents a quality of a video track.
 *
 * @public
 */
export interface VideoQuality extends Quality {
  /**
   * The video height of the video quality, in pixels.
   */
  readonly height: number;

  /**
   * The video width of the video quality, in pixels.
   */
  readonly width: number;

  /**
   * The framerate of the video quality.
   */
  readonly frameRate: number;

  /**
   * The timestamp of the first frame of the video quality, in seconds.
   */
  readonly firstFrame: number;
}

/**
 * Represents a quality of an audio track.
 *
 * @public
 */
export interface AudioQuality extends Quality {
  /**
   * The sampling rate of the audio quality.
   */
  readonly audioSamplingRate: number | [number, number];
}
