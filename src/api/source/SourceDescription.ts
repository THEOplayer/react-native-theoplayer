/**
 * Represents a media resource.
 *
 * @remarks
 * <br/> - Can be a string value representing the URL of a media resource, a {@link TypedSource}.
 *
 * @category Source
 * @public
 */
import type { DashPlaybackConfiguration } from './dash/DashPlaybackConfiguration';
import type { DRMConfiguration } from './drm/DRMConfiguration';
import type { HlsPlaybackConfiguration } from './hls/HlsPlaybackConfiguration';
import type { AdDescription } from './ads/Ads';
import type { MetadataDescription } from './metadata/MetadataDescription';
import type { ServerSideAdInsertionConfiguration } from './ads/ssai/ServerSideAdInsertionConfiguration';
import type { AnalyticsDescription } from './analytics/AnalyticsDescription';
import { CmcdConfiguration } from './cmcd/CmcdConfiguration';

/**
 * A type alias for a {@link TypedSource} media resource.
 *
 * @category Source
 * @public
 */
export type Source = TypedSource;

/**
 * A media resource or list of media resources.
 *
 * @remarks
 * <br/> - The order of sources when using a list determines their priority when attempting playback.
 *
 * @category Source
 * @public
 */
export type Sources = Source | Source[];

/**
 * The cross-origin setting of a source, represented by a value from the following list:
 * <br/> - `'anonymous'`: CORS requests will have the credentials flag set to 'same-origin'.
 * <br/> - `'use-credentials'`: CORS requests will have the credentials flag set to 'include'.
 * <br/> - `''`: Setting the empty string is the same as `'anonymous'`
 *
 * @remarks
 * <br/> - See {@link https://developer.mozilla.org/en-US/docs/Web/HTML/CORS_settings_attributes | The crossorigin attribute: Requesting CORS access to content}
 *
 * @category Source
 * @public
 */
export type CrossOriginSetting = '' | 'anonymous' | 'use-credentials';

/**
 * The integration identifier of a source specific to a pre-integration, represented by a value from the following list:
 * <br/> - `'theolive'`: The source contains the THEOlive initialization url.
 *
 * @category Source
 * @public
 */
export enum SourceIntegrationId {
  THEO_LIVE = 'theolive'
}

/**
 * The playback pipeline to use to play a stream.
 *
 * @category Source
 * @platform android
 * @public
 */
export enum PlaybackPipeline {
  LEGACY = 'legacy',
  MEDIA3 = 'media3'
}

/**
 * Describes the configuration of a player's source.
 *
 * @category Source
 * @public
 */
export interface SourceConfiguration {
  /**
   * List of {@link AdDescription}s to be queued for playback.
   */
  ads?: AdDescription[];

  /**
   * Content protection configuration.
   */
  contentProtection?: DRMConfiguration;

  /**
   * The poster of the media source.
   *
   * @remarks
   * <br/> - An empty string (`''`) clears the current poster.
   */
  poster?: string;

  /**
   * List of text tracks to be side-loaded with the media source.
   *
   * @remarks
   * <br/> - A source change will reset side-loaded text tracks.
   */
  textTracks?: TextTrackDescription[];

  /**
   * The URL of a time server used by the player to synchronise the time in DASH sources.
   *
   * @remarks
   * <br/> - The time server should return time in ISO-8601 format.
   * <br/> - Overrides the time server provided the DASH manifest's `<UTCTiming>`.
   * <br/> - All sources will use the time server. Alternatively, for one source use {@link BaseSource.timeServer}.
   */
  timeServer?: string;

  /**
   * Whether the player should parse and expose date ranges from HLS playlists.
   *
   * @defaultValue `false`
   */
  hlsDateRange?: boolean;

  /**
   * Describes the metadata of a source.
   *
   * @public
   */
  metadata?: MetadataDescription;

  /**
   * List of {@link AnalyticsDescription}s to configure source-related properties for analytics connectors.
   */
  analytics?: AnalyticsDescription[];

  /**
   * The configuration for transmitting information to Content Delivery Networks (CDNs)
   * through Common Media Client Data (CMCD) (CTA-5004)
   */
  cmcd?: CmcdConfiguration;
}

/**
 * Describes the configuration of a player's source.
 *
 * @category Source
 * @public
 */
export interface SourceDescription extends SourceConfiguration {
  /**
   * One or more media resources for playback.
   *
   * @remarks
   * <br/> - Multiple media sources should be used to increase platform compatibility. See examples below for important use cases.
   * <br/> - The player will try each source in the provided order.
   *
   * @example
   * In this example, the player will first try to play the DASH source.
   * This might fail if the browser does not support the {@link https://www.widevine.com/ | Widevine} or {@link https://www.microsoft.com/playready/ | PlayReady} CDM, for example on Safari.
   * In that case, the player will try to play the HLS source instead.
   *
   * ```
   * [{
   *   src: 'dash-source-with-drm.mpd'
   *   contentProtection: {
   *     widevine: {
   *       licenseAcquisitionURL: 'https://license.company.com/wv'
   *     },
   *     playready: {
   *       licenseAcquisitionURL: 'https://license.company.com/pr'
   *     }
   *   }
   * },{
   *   src: 'hls-source-with-drm.m3u8',
   *   contentProtection: {
   *     fairplay: {
   *       certificateURL: 'https://license.company.com/fp'
   *     }
   *   }
   * }]
   * ```
   *
   * @example
   * In this example, the player will first try to play the DASH source.
   * This might fail if the browser does not support the {@link https://developer.mozilla.org/en-US/docs/Web/API/Media_Source_Extensions_API | Media Source Extensions API}.
   * In that case, the player will try to play the MP4 source instead, though without features such as adaptive bitrate switching.
   *
   * ```
   * [{
   *   src: 'source.mpd'
   * },{
   *   src: 'source.mp4'
   * }]
   * ```
   */
  sources?: Sources;
}

/**
 * Describes the configuration of a side-loaded text track.
 *
 * @category Source
 * @category Media and Text Tracks
 * @public
 */
export interface TextTrackDescription {
  /**
   * Whether the text track should be enabled by default.
   *
   * @remarks
   * <br/> - Only one text track per {@link TextTrack.kind} may be marked as default.
   *
   * @defaultValue `false`
   */
  default?: boolean;

  /**
   * The kind of the text track, represented by a value from the following list:
   * <br/> - `'subtitles'`: The track provides subtitles, used to display subtitles in a video.
   * <br/> - `'captions'`: The track provides a translation of dialogue and sound effects (suitable for users with a hearing impairment).
   * <br/> - `'descriptions'`: The track provides a textual description of the video (suitable for users with a vision impairment).
   * <br/> - `'chapters'`: The track provides chapter titles (suitable for navigating the media resource).
   * <br/> - `'metadata'`: The track provides content used by scripts and is not visible for users.
   *
   * @remarks
   * <br/> -  If an unrecognized value is provided, the player will interpret it as `'metadata'`.
   *
   * @defaultValue `'subtitles'`
   */
  kind?: string;

  /**
   * The format of the track, represented by a value from the following list:
   * <br/> - `'srt'`
   * <br/> - `'ttml'`
   * <br/> - `'webvtt'`
   * <br/> - `'emsg'`
   * <br/> - `'eventstream'`
   * <br/> - `'id3'`
   * <br/> - `'cea608'`
   * <br/> - `'daterange'`
   *
   * @defaultValue `''`
   */
  format?: string;

  /**
   * The source URL of the text track.
   */
  src: string;

  /**
   * The language of the text track.
   */
  srclang?: string;

  /**
   * A label for the text track.
   *
   * @remarks
   * <br/> - This will be used as an identifier on the player API and in the UI.
   */
  label?: string;

  /**
   * The identifier of this text track.
   *
   * @internal
   */
  // Note: This works for HLS, but not for DASH.
  id?: string;

  /**
   * The PTS value used to sync the track with the video.
   *
   * @internal
   *
   * @platform ios
   */
  subtitlePTS?: string;

  /**
   * The localTime that matches the PTS value that is used to sync the track with the video.
   *
   * @internal
   *
   * @platform ios
   *
   * @remarks
   * <br/> - Format: "HH:mm:mm:SSS"
   * <br/> - Default value is "00:00:00:000"
   */
  subtitleLocaltime?: string;
}

/**
 * Represents the common properties of a media resource.
 *
 * @category Source
 * @public
 */
export interface BaseSource {
  /**
   * The integration ID of the source.
   *
   * @remarks
   * <br/> - This can be used to signal that a source is specific to an integration.
   */
  integration?: SourceIntegrationId;

  /**
   * The cross-origin setting of the source.
   *
   * @defaultValue `''`
   */
  crossOrigin?: CrossOriginSetting;

  /**
   * The offset in seconds used to determine the live point.
   * This live point is the end of the manifest minus the provided offset.
   *
   * @platform web,android
   *
   * @defaultValue Three times the segment's target duration.
   */
  liveOffset?: number;

  /**
   * The URL of a time server used by the player to synchronise the time in DASH sources.
   *
   * @remarks
   * <br/> - The time server should return time in ISO-8601 format.
   * <br/> - Overrides the time server provided the DASH manifest's `<UTCTiming>`.
   * <br/> - Only this source will use the time server. Alternatively, for all source use {@link SourceConfiguration.timeServer}.
   */
  timeServer?: string;

  /**
   * Whether the source should be played in the low-latency-mode of the player.
   *
   * @defaultValue `false`
   *
   * @remarks
   * <br/> - This setting must be `true` when using Low-Latency CMAF with ABR.
   */
  lowLatency?: boolean;

  /**
   * The configuration for controlling playback of an MPEG-DASH stream.
   *
   * @remarks
   * <br/> - Ignored for non-DASH streams.
   */
  dash?: DashPlaybackConfiguration;

  /**
   * The configuration for controlling playback of an HLS stream.
   *
   * @remarks
   * <br/> - Ignored for non-HLS streams.
   */
  hls?: HlsPlaybackConfiguration;

  /**
   * The playback pipeline to use for this stream.
   *
   * @defaultValue [PlaybackPipeline.MEDIA3]
   * @since React Native THEOplayer SDK v9.0.0.
   * @since Native THEOplayer SDK v9.0.0.
   * @platform android
   */
  playbackPipeline?: PlaybackPipeline;
}

/**
 * Represents a media resource characterized by a URL to the resource and optionally information about the resource.
 *
 * @category Source
 * @public
 */
export interface TypedSource extends BaseSource {
  /**
   * The source URL of the media resource.
   *
   * @remarks
   * <br/> - Required if the `ssai` property is absent.
   */
  src?: string;

  /**
   * The content type (MIME type) of the media resource, represented by a value from the following list:
   * <br/> - `'application/dash+xml'`: The media resource is an MPEG-DASH stream.
   * <br/> - `'application/x-mpegURL'` or `'application/vnd.apple.mpegurl'`: The media resource is an HLS stream.
   * <br/> - `'video/mp4'`, `'video/webm'` and other formats: The media resource should use native HTML5 playback if supported by the browser.
   * <br/> - `'application/vnd.theo.hesp+json'`: The media resource is an HESP stream.
   */
  type?: string;

  /**
   * The content protection parameters for the media resource.
   */
  contentProtection?: DRMConfiguration;

  /**
   * The headers included in the request when retrieving the resource.
   *
   * @platform ios,android
   *
   * @since React Native THEOplayer SDK v7.9.0.
   */
  headers?: { [key: string]: string };

  /**
   * The Server-side Ad Insertion parameters for the media resource.
   */
  ssai?: ServerSideAdInsertionConfiguration;
}
