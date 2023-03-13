import type { Airplay } from './Airplay';
import type { Chromecast } from './Chromecast';

/**
 * The API for casting.
 */

export interface CastAPI {
  /**
   * Whether the player is connected with a casting device.
   */
  readonly casting: boolean;

  /**
   * The Chromecast API.
   *
   * @remarks
   * <br/> - Only available when the feature or extension `'chromecast'` is enabled.
   */
  readonly chromecast?: Chromecast;

  /**
   * The Airplay API.
   *
   * @remarks
   * <br/> - Only available when the feature or extension `'airplay'` is enabled.
   */
  readonly airplay?: Airplay;
}
