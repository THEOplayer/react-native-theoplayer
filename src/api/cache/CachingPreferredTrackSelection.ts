/**
 * The preferred track selection.
 *
 * @category Caching
 * @public
 */
export interface CachingPreferredTrackSelection {
  /**
   * The list of language tags that indicates the preferred audio tracks to be cached.
   *
   * An empty array will result to picking the first available track.
   */
  audioTrackSelection: string[];

  /**
   * The expiration date of the cached data.
   *
   * @remarks
   * <br/> - Must be a date in the future.
   * <br/> - Data might be removed by the browser if it runs out of disk space.
   *
   * @defaultValue 30 minutes after starting the caching task.
   */
  textTrackSelection?: string[];
}
