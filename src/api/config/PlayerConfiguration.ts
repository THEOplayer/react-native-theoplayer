import type { AdsConfiguration } from '../ads/AdsConfiguration';
import type { CastConfiguration } from '../cast/CastConfiguration';
import type { MediaControlConfiguration } from '../media/MediaControlConfiguration';
import type { RetryConfiguration } from '../utils/RetryConfiguration';
import type { UIConfiguration } from '../ui/UIConfiguration';

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
   * The ui configuration for the underlying native player. Applies to Ad UI.
   */
  ui?: UIConfiguration;

  /**
   * The configuration of media controls and media sessions across platforms.
   */
  mediaControl?: MediaControlConfiguration;

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
   *
   * @remarks
   * <br/> - This parameter only applies to Web platforms.
   */
  readonly chromeless?: boolean;

  /**
   * Sets whether DateRange tags from the playlists should be imported as a textTrack.
   */
  readonly hlsDateRange?: boolean;

  /**
   * The retry configuration for the player.
   *
   * @remarks
   * <br/> - This parameter only applies to Web and Android platforms.
   */
  readonly retryConfiguration?: RetryConfiguration;
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
