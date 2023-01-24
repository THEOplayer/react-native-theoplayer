import type { EventDispatcher } from '../event/EventDispatcher';
import type { PlayerEventMap } from './PlayerEventMap';
import type { ABRConfiguration } from '../abr/ABRConfiguration';
import type { SourceDescription } from '../source/SourceDescription';
import type { AdsAPI } from '../ads/AdsAPI';
import type { CastAPI } from '../cast/CastAPI';

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
   * Determines whether the player is currently playing in fullscreen.
   */
  fullscreen: boolean;

  /**
   * Used to set the current selected text track by passing its `uid`, or `undefined` to select none.
   */
  selectedTextTrack: number | undefined;

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
}
