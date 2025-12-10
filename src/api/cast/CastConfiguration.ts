/**
 * Describes the configuration of the Cast integrations.
 *
 * @category Casting
 * @public
 */
export interface CastConfiguration {
  /**
   * The Chromecast configuration.
   *
   * @defaultValue A {@link ChromecastConfiguration} with default values.
   */
  chromecast?: ChromecastConfiguration;

  /**
   * The join strategy of the player.
   *
   * @defaultValue `'manual'`
   */
  strategy?: JoinStrategy;

  /**
   * A flag to enable experimental pipeline with latest features for Chromecast.
   *
   * @defaultValue `'false'`
   *
   * @platform iOS
   */
  useExperimentalPipeline?: boolean;
}

/**
 * The join strategy, represented by a value from the following list:
 * <br/> - `'auto'` : The player will automatically join a cast session if one exists when play is called. Otherwise it will prompt the user with all available devices.
 * <br/> - `'manual'` : The player will take over an existing session if there is one and the cast button is clicked. Otherwise it will prompt the user with all available devices.
 * <br/> - `'disabled'` : The player is not affected by cast sessions and is not castable.
 *
 * @category Casting
 * @public
 */
export type JoinStrategy = 'auto' | 'manual' | 'disabled';

/**
 * Describes the configuration of the Chromecast integration.
 *
 * @category Casting
 * @public
 */
export interface ChromecastConfiguration {
  /**
   * The identifier of a custom Chromecast receiver app.
   *
   * @defaultValue The default THEOplayer receiver app.
   */
  appID?: string;
}
