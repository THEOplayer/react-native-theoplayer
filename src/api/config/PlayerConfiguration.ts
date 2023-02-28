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
   * The muted autoplay policy for web.
   *
   * @remarks
   * <br/> - The muted autoplay policy is impacted by this property and {@link SourceConfiguration.mutedAutoplay}.
   *
   * @defaultValue `'none'`.
   */
  mutedAutoplay?: MutedAutoplayConfiguration;

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

/**
 * The muted autoplay policy of a player for web.
 * <br/> - `'none'`: Disallow muted autoplay. If the player is requested to autoplay while unmuted, and the platform does not support unmuted autoplay, the player will not start playback.
 * <br/> - `'all'`: Allow muted autoplay. If the player is requested to autoplay while unmuted, and the platform supports muted autoplay, the player will start muted playback.
 * <br/> - `'content'`: Allow muted autoplay only for the main content. Disallow muted autoplay for e.g. advertisements. (Not yet supported.)
 *
 * @public
 */
export type MutedAutoplayConfiguration = 'none' | 'all' | 'content';
