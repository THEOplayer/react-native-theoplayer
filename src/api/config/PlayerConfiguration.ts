export interface PlayerConfiguration {
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
