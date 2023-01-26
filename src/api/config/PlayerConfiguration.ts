import type { AdsConfiguration } from '../ads/AdsConfiguration';
import type { CastConfiguration } from '../cast/CastConfiguration';

export interface PlayerConfiguration {
  /**
   * The directory in which the THEOplayer library worker files are located.
   * These worker files are THEOplayer.transmux.*
   *
   * @remarks
   * <br/> - This parameter is required when using a HLS source and has no default.
   *
   * @example
   * `'/lib/theoplayer/'`
   */
  libraryLocation?: string;

  /**
   * The ads configuration for the player.
   */
  ads?: AdsConfiguration;

  /**
   * The cast configuration for the player.
   */
  cast?: CastConfiguration;

  /**
   * The license for the player
   */
  readonly license?: string;

  /**
   * The url to fetch the license for the player
   */
  readonly licenseUrl?: string;

  /**
   * Sets whether the native player is chromeless (without UI).
   */
  readonly chromeless?: boolean;
}
