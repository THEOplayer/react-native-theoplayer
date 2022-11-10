/**
 * The adaptive bitrate strategy of the first segment, represented by a value from the following list:
 * <br/> - `'performance'`: The player will optimize ABR behavior to focus on the performance of the player. This strategy initiates playback with the lowest quality suitable for the device which means faster start-up time.
 * <br/> - `'quality'`: The player will optimize ABR behavior to focus displaying the best visual quality to the end-user. This strategy initiates playback with the highest bit rate suitable for the device.
 * <br/> - `'bandwidth'`: The player will optimize the ABR behavior to focus on displaying the most optimal quality based on historic data of available bandwidth and knowledge of the network conditions.
 *
 * @public
 */
export type ABRStrategyType = 'performance' | 'quality' | 'bandwidth';

/**
 * Describes the metadata of the adaptive bitrate strategy.
 *
 * @public
 */
export interface ABRMetadata {
  /**
   * The initial bitrate, in bits per second.
   *
   * @defaultValue Bitrate available to the browser.
   */
  bitrate?: number;
}

/**
 * Describes the configuration of the adaptive bitrate strategy.
 *
 * @public
 */
export interface ABRStrategyConfiguration {
  /**
   * The strategy for initial playback.
   */
  type: ABRStrategyType;

  /**
   * The metadata for the initial playback strategy.
   *
   * @defaultValue A {@link ABRMetadata} object with default values.
   */
  metadata?: ABRMetadata;
}

/**
 * The adaptive bitrate stratey.
 *
 * @public
 */
export type ABRStrategy = ABRStrategyConfiguration | ABRStrategyType;

/**
 * Describes the adaptive bitrate configuration.
 *
 * @public
 */
export interface ABRConfiguration {
  /**
   * The adaptive bitrate strategy.
   *
   * @defaultValue `'bandwidth'`
   */
  strategy?: ABRStrategy;

  /**
   * The amount which the player should buffer ahead of the current playback position, in seconds.
   *
   * @remarks
   * <br/> - Before v4.3.0: This duration has a maximum of 60 seconds.
   * <br/> - After v4.3.0: This duration has no maximum.
   * <br/> - The player might reduce or ignore the configured amount because of device or performance constraints.
   *
   * @defaultValue `20`
   */
  targetBuffer?: number;

  /**
   * The amount of data which the player should keep in its buffer before the current playback position, in seconds.
   * This configuration option can be used to reduce the memory footprint on memory restricted devices or on devices
   * which don't automatically prune decoder buffers.
   *
   * Note that the player can decide to keep less data in the decoder buffer in case memory is running low.
   * A value of 0 or lower is not accepted and will be treated as default.
   *
   * @defaultValue `30`
   *
   * @remarks
   * <br/> - This property is currently supported on Web platforms only.
   */
  bufferLookbackWindow?: number;

  /**
   * The maximum length of the player's buffer, in seconds.
   *
   * The player will initially buffer up to {@link ABRConfiguration.targetBuffer} seconds of media data.
   * If the player detects that the decoder is unable to hold so much data,
   * it will reduce `maxBufferLength` and restrict `targetBuffer` to be less than
   * this maximum.
   *
   * @remarks
   * <br/> - This property is currently supported on Web platforms only.
   */
  readonly maxBufferLength?: number;
}
