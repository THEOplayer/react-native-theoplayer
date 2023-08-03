import type { CachingPreferredTrackSelection } from "./CachingPreferredTrackSelection";

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
}
