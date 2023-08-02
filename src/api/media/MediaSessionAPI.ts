/**
 * The API for controlling the player's mediaSession.
 *
 * @remarks
 * <br/> - This feature is only available for Android.
 */
export interface MediaSessionAPI {

  /**
   * Toggle mediaSession active flag.
   */
  setActive(active: boolean): void;
}
