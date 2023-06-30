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

export type PreloadType = 'none' | 'metadata' | 'auto' | '';

/**
 * Specifies an aspect ratio for the player.
 *
 * <br/> - `FIT` (default): Scales the player so that all content fits inside its bounding box, keeping the original aspect ratio of the content..
 * <br/> - `FILL`: Scales the player so that all content fits inside the bounding box, which will be stretched to fill it entirely.
 * <br/> - `ASPECT_FILL`: Scales the player so that the content fills up the entire bounding box, keeping the original aspect ratio of the content.
 *
 * @public
 * @defaultValue `'FIT'`
 */
export enum AspectRatio {
  FIT = 'fit',
  FILL = 'fill',
  ASPECT_FILL = 'aspectFill',
}

export type NativeHandleType = unknown;

/**
 * The THEOplayer API.
 */
export interface THEOplayer extends EventDispatcher<PlayerEventMap> {
  /**
   * The player's adaptive bitrate (ABR) configuration.
   *
   * @remarks
   * <br/> - This property is supported on Android & Web platforms only.
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
   *
   * @remarks
   * Only available for Web.
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
   * Used to set the aspect ratio of the player.
   *
   * @remarks
   * Only available for iOS and Android.
   */
  aspectRatio: AspectRatio;

  /**
   * The active configuration for PiP.
   */
  pipConfiguration: PiPConfiguration;

  /**
   * The active configuration for PiP.
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
   * The API for casting devices.
   */
  readonly cast: CastAPI;

  /**
   * The player version.
   */
  readonly version: PlayerVersion;

  /**
   * Native player handle.
   */
  readonly nativeHandle: NativeHandleType;
}
