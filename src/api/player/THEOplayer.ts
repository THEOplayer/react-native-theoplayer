import type { EventDispatcher } from '../event/EventDispatcher';
import type { PlayerEventMap } from './PlayerEventMap';
import type { ABRConfiguration } from '../abr/ABRConfiguration';
import type { SourceDescription } from '../source/SourceDescription';
import type { AdsAPI } from '../ads/AdsAPI';
import type { CastAPI } from '../cast/CastAPI';
import type { MediaTrack } from '../track/MediaTrack';
import type { TextTrack } from '../track/TextTrack';
import type { TimeRange } from '../timeranges/TimeRange';
import type { TextTrackStyle } from '../track/TextTrackStyle';
import type { PresentationMode } from '../presentation/PresentationMode';
import type { PiPConfiguration } from '../pip/PiPConfiguration';
import type { BackgroundAudioConfiguration } from '../backgroundAudio/BackgroundAudioConfiguration';
import type { PlayerVersion } from './PlayerVersion';
import type { EventBroadcastAPI } from '../broadcast/EventBroadcastAPI';
import { TheoAdsAPI } from '../theoads/TheoAdsAPI';
import { TheoLiveAPI } from '../theolive/TheoLiveAPI';

export type PreloadType = 'none' | 'metadata' | 'auto' | '';

/**
 * Specifies an aspect ratio for the player.
 *
 * <br/> - `FIT` (default): Scales the player so that all content fits inside its bounding box, keeping the original aspect ratio of the content.
 * <br/> - `FILL`: Scales the player so that all content fits inside the bounding box, which will be stretched to fill it entirely.
 * <br/> - `ASPECT_FILL`: Scales the player so that the content fills up the entire bounding box, keeping the original aspect ratio of the content.
 *
 * @category Player
 * @public
 * @defaultValue `'FIT'`
 */
export enum AspectRatio {
  FIT = 'fit',
  FILL = 'fill',
  ASPECT_FILL = 'aspectFill',
}

/**
 * Specifies the rendering target for the player.
 *
 * <br/> - `SURFACE_VIEW` (default): Render video to a {@link https://developer.android.com/reference/android/view/SurfaceView | SurfaceView}.
 * <br/> - `TEXTURE_VIEW`: Render video to a {@link https://developer.android.com/reference/android/view/TextureView | TextureView}.
 *
 * @category Player
 * @public
 * @defaultValue `'SURFACE_VIEW'`
 */
export enum RenderingTarget {
  SURFACE_VIEW = 'surfaceView',
  TEXTURE_VIEW = 'textureView',
}

export type NativeHandleType = unknown;

/**
 * The THEOplayer API.
 *
 * @category Player
 * @public
 */
export interface THEOplayer extends EventDispatcher<PlayerEventMap> {
  /**
   * The player's adaptive bitrate (ABR) configuration.
   */
  readonly abr: ABRConfiguration | undefined;

  /**
   * A source description that determines the current media resource.
   */
  source: SourceDescription | undefined;

  /**
   * Start or resume playback.
   */
  play(): void;

  /**
   * Pause playback.
   */
  pause(): void;

  /**
   * Whether the player is paused.
   */
  readonly paused: boolean;

  /**
   * Whether the player should immediately start playback after source change.
   */
  autoplay: boolean;

  /**
   * The preload setting of the player.
   */
  preload: PreloadType;

  /**
   * Returns a list of TimeRanges that represents the ranges of the media resource that are seekable by the player.
   */
  seekable: TimeRange[];

  /**
   * Returns a list of TimeRanges that represents the ranges of the media resource that are buffered by the player.
   */
  buffered: TimeRange[];

  /**
   * Used to set the playback rate of the media.
   *
   * @example
   * <br/> - `playbackRate = 0.70` will slow down the playback rate of the media by 30%.
   * <br/> - `playbackRate = 1.25` will speed up the playback rate of the media by 25%.
   *
   * @remarks
   * <br/> - Playback rate is represented by a number where `1` is default playback speed.
   * <br/> - Playback rate must be a positive number.
   * <br/> - It is recommended that you limit the range to between 0.5 and 4.
   */
  playbackRate: number;

  /**
   * Used to set the volume of the audio.
   *
   * @remarks
   * <br/> - Volume is represented by a floating point number between `0.0` and `1.0`.
   */
  volume: number;

  /**
   * Determines whether audio is muted.
   */
  muted: boolean;

  /**
   * Whether the player is seeking.
   */
  readonly seeking: boolean;

  /**
   * The PresentationMode of the player. Can be switched to: `picture-in-picture`, `fullscreen` or `inline`
   */
  presentationMode: PresentationMode;

  /**
   * List of audio tracks of the current source.
   */
  audioTracks: MediaTrack[];

  /**
   * List of video tracks of the current source.
   */
  videoTracks: MediaTrack[];

  /**
   * List of text tracks of the current source.
   */
  textTracks: TextTrack[];

  /**
   * Used to set the current selected text track by passing its `uid`, or `undefined` to select none.
   */
  selectedTextTrack: number | undefined;

  /**
   * The text track style API.
   */
  readonly textTrackStyle: TextTrackStyle;

  /**
   * Used to set the current selected video track by passing its `uid`, or `undefined` to select none.
   */
  selectedVideoTrack: number | undefined;

  /**
   * Used to set the current selected video quality by passing its `uid`, or `undefined` to select none.
   */
  targetVideoQuality: number | number[] | undefined;

  /**
   * Used to set the current selected audio track by passing its `uid`, or `undefined` to select none.
   */
  selectedAudioTrack: number | undefined;

  /**
   * The current playback position of the media, in milliseconds.
   */
  currentTime: number;

  /**
   * The programDateTime for the current playback position of the media, in milliseconds.
   */
  currentProgramDateTime: number | undefined;

  /**
   * Used to set the aspect ratio of the player.
   *
   * @platform ios,android
   */
  aspectRatio: AspectRatio;

  /**
   * Specifies where the player is displaying the video.
   *
   * @defaultValue `SURFACE_VIEW`
   *
   * @platform android
   */
  renderingTarget?: RenderingTarget;

  /**
   * Toggle the wake-lock on the player view. The screen will time out if disabled.
   *
   * @defaultValue `true`
   *
   * @platform android
   */
  keepScreenOn: boolean;

  /**
   * The active configuration for PiP.
   */
  pipConfiguration: PiPConfiguration;

  /**
   * The active configuration for background audio playback.
   */
  backgroundAudioConfiguration: BackgroundAudioConfiguration;

  /**
   * The duration of the media, in milliseconds.
   */
  readonly duration: number;

  /**
   * The API for advertisements.
   */
  readonly ads: AdsAPI;

  /**
   * The API for THEOads advertisements.
   */
  readonly theoads: TheoAdsAPI;

  /**
   * The API for casting devices.
   */
  readonly cast: CastAPI;

  /**
   * The player version.
   *
   * @deprecated use {@link sdkVersions} instead.
   */
  readonly version: PlayerVersion;

  /**
   * Native player handle.
   */
  readonly nativeHandle: NativeHandleType;

  /**
   * Event Broadcast API.
   */
  readonly broadcast: EventBroadcastAPI;

  /**
   * The width of the player.
   */
  readonly width: number | undefined;

  /**
   * The height of the player.
   */
  readonly height: number | undefined;

  /**
   * The width of the active video rendition, in pixels.
   */
  readonly videoWidth: number | undefined;

  /**
   * The height of the active video rendition, in pixels.
   */
  readonly videoHeight: number | undefined;

  /**
   * The API for THEOlive.
   */
  readonly theoLive: TheoLiveAPI;

  /**
   * The API for THEOlive.
   *
   * @deprecated use {@link THEOplayer.theoLive} instead.
   */
  readonly theolive: TheoLiveAPI;
}
