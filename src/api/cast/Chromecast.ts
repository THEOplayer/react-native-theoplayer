/**
 * The Airplay API.
 *
 * @public
 */
import type {CastState} from "./CastState";

export interface Chromecast {
  /**
   * Whether the player is connected with a chromecast device.
   */
  casting(): Promise<boolean>;

  /**
   * The state of the casting process.
   */
  state(): Promise<CastState>;

  /**
   * Start a casting session with the player's source.
   *
   * @remarks
   * <br/> - A native browser pop-up will prompt to choose a chromecast device.
   */
  start(): void;

  /**
   * Stop the active casting session.
   */
  stop(): void;

  /**
   * Join an active casting session.
   */
  join(): void;

  /**
   * Leave the active casting session.
   *
   * @remarks
   * <br/> - Does not stop the session when other devices are connected.
   * <br/> - Use {@link stop} to fully stop the session.
   */
  leave(): void;
}
