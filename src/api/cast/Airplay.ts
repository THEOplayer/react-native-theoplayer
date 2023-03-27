/**
 * The Airplay API.
 *
 * @public
 */
import type { CastState } from './CastState';

export interface Airplay {
  /**
   * Whether the player is connected with an airplay device.
   */
  readonly casting: boolean;

  /**
   * The state of the casting process.
   */
  readonly state: CastState;

  /**
   * Start a casting session with the player's source.
   *
   * @remarks
   * <br/> - A native browser pop-up will prompt to choose an airplay device.
   */
  start(): void;

  /**
   * Stop the active casting session.
   */
  stop(): void;
}
