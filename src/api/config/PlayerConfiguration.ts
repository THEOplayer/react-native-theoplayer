import type { AdsConfiguration } from '../ads/AdsConfiguration';
import type { CastConfiguration } from '../cast/CastConfiguration';
import type { MediaControlConfiguration } from '../media/MediaControlConfiguration';
import type { RetryConfiguration } from '../utils/RetryConfiguration';
import type { UIConfiguration } from '../ui/UIConfiguration';
import { TheoLiveConfiguration } from '../theolive/TheoLiveConfiguration';

/**
 * Describes a player's configuration.
 *
 * @category Player
 * @public
 */
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
   * <br/> - The muted autoplay policy is impacted by this property and {@link theoplayer!SourceConfiguration.mutedAutoplay}.
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
   * Sets whether DateRange tags from the playlists should be imported as a textTrack.
   */
  readonly hlsDateRange?: boolean;

  /**
   * The retry configuration for the player.
   *
   * @platform web,android
   */
  readonly retryConfiguration?: RetryConfiguration;

  /**
   * The offset in seconds used to determine the live point.
   * This live point is the end of the manifest minus the provided offset.
   *
   * @defaultValue Three times the target duration of a segment, as specified by the manifest.
   *
   * @platform web,android
   */
  liveOffset?: number;

  /**
   * The THEOlive configuration for the player.
   */
  theoLive?: TheoLiveConfiguration;

  /**
   * Whether multimedia tunneling is enabled for the player or not.
   *
   * @defaultValue false
   *
   * @platform android
   *
   * @remarks
   * <br/> - Only supported with the Media3 integration.
   * <br/> - Only supported if the media being played includes both audio and video.
   * <br/> - Only supported on limited number of video codecs and devices.
   */
  tunnelingEnabled?: boolean;

  /**
   * Whether the player should use android.net.http.HttpEngine or Cronet for its network stack, if available.
   *
   * @defaultValue true
   *
   * @platform android
   *
   * @remarks
   * <br/> - Only supported with the Media3 integration.
   * <br/> - When set to true, the player will attempt to use either android.net.http.HttpEngine or Cronet for its network requests.
   * <br/> - When set to false, the player will always use java.net.HttpURLConnection.
   */
  useHttpEngine?: boolean;
}

/**
 * The muted autoplay policy of a player for web.
 *
 * @remarks
 * <br/> - `'none'`: Disallow muted autoplay. If the player is requested to autoplay while unmuted, and the platform does not support unmuted autoplay, the player will not start playback.
 * <br/> - `'all'`: Allow muted autoplay. If the player is requested to autoplay while unmuted, and the platform supports muted autoplay, the player will start muted playback.
 * <br/> - `'content'`: Allow muted autoplay only for the main content. Disallow muted autoplay for e.g. advertisements. (Not yet supported.)
 *
 * @public
 */
export type MutedAutoplayConfiguration = 'none' | 'all' | 'content';
