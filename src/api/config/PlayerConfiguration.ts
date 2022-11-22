import type { AdsConfiguration } from "../ads/AdsConfiguration";

export interface PlayerConfiguration {
  /**
   * The ads configuration for the player.
   */
  ads?: AdsConfiguration;

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
