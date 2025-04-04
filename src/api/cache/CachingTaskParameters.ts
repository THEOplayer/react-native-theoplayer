import type { CachingPreferredTrackSelection } from "./CachingPreferredTrackSelection";

/**
 * The types of cache storage supported by THEOplayer.
 *
 * @remarks
 * <br/> - Available only on Android.
 */
export enum StorageType {
  /**
   * Write to the legacy cache.
   *
   * @remarks
   * <br/> - This was the default for all caching tasks created in THEOplayer version 8.x and earlier.
   * <br/> - Sources cached with this storage type can be played in both the default playback pipeline and the Media3 playback pipeline.
   * <br/> - This cache storage will be removed in THEOplayer version 10.
   */
  LEGACY = 'legacy',

  /**
   * Write to the Media3 cache.
   *
   * @remarks
   * <br/> - This is the default starting with THEOplayer version 9.0.
   * <br/> - Sources cached with this storage type can only be played in the [Media3 playback pipeline][PlaybackPipeline.MEDIA3].
   */
  MEDIA3 = 'media3'
}

/**
 * Describes the configuration of a caching task.
 *
 * @public
 */
export interface CachingTaskParameters {
  /**
   * The amount of data to cache for the given stream.
   *
   * @remarks
   * <br/> - Available only on Web and Android. On iOS this value we always be '100%'.
   *
   * Possible formats:
   * <br/> - A number in seconds.
   * <br/> - A percentage string (XX%) for a proportion of the content duration.
   *
   */
  readonly amount: number | string;

  /**
   * The expiration date of the cached data.
   *
   * @remarks
   * <br/> - Must be a date in the future.
   * <br/> - Data might be removed by the browser if it runs out of disk space.
   *
   * @defaultValue 30 minutes after starting the caching task.
   */
  readonly expirationDate?: Date;

  /**
   * Upper bandwidth limit of the quality to cache.
   *
   * @remarks
   * <br/> - This will take the quality with the highest bandwidth that is lower than the specified bandwidth.
   * <br/> - It should be a value between zero and infinity.
   *
   * @defaultValue Infinity
   */
  readonly bandwidth?: number;

  /**
   * The preferred audio/text tracks to cache.
   *
   * @remarks
   * <br/> - Available only on iOS and Android.
   * <br/> - By default, the first track will be picked.
   */
  readonly preferredTrackSelection?: CachingPreferredTrackSelection;

  /**
   * An indication of whether the data should be cached on a cellular network, or only on WIFI. Defaults to true.
   *
   * @remarks
   * <br/> - Available only on iOS.
   * <br/> - The value can not be changed on a scheduled asset.
   * <br/> - If the download is scheduled/started on WIFI-only mode, and suddenly we would like allow Cellular Network download too, the `CachingTask` has to be removed and scheduled again with the new `CachingParamaters`.
   */
  readonly allowsCellularAccess?: boolean;

  /**
   * The storage type to use for caching.
   *
   * @remarks
   * <br/> - Available only on Android.
   *
   * @defaultValue [StorageType.MEDIA3]
   */
  readonly storageType?: StorageType;
}
