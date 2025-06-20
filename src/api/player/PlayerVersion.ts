/**
 * Provides version info of the player.
 *
 * @category Player
 * @public
 */
export interface PlayerVersion {
  /**
   * The version of the THEOplayer SDK.
   *
   * @public
   */
  readonly version: string;

  /**
   * The player suite version of the THEOplayer SDK.
   *
   * @public
   */
  readonly playerSuiteVersion: string;
}
