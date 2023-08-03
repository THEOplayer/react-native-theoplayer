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
   * Possible formats:
   * <br/> - A number in seconds.
   * <br/> - A percentage string (XX%) for a proportion of the content duration.
   * <br/> - Available only on Web and Android. On iOS this value we always be '100%'.
   */
  amount: number | string;

  /**
   * The expiration date of the cached data.
   *
   * @remarks
   * <br/> - Must be a date in the future.
   * <br/> - Data might be removed by the browser if it runs out of disk space.
   *
   * @defaultValue 30 minutes after starting the caching task.
   */
  expirationDate?: Date;

  /**
   * Upper bandwidth limit of the quality to cache.
   *
   * @remarks
   * <br/> - This will take the quality with the highest bandwidth that is lower than the specified bandwidth.
   * <br/> - It should be a value between zero and infinity.
   *
   * @defaultValue Infinity
   */
  bandwidth?: number;
}
