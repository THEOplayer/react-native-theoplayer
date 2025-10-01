import type { MediaTrack, PlayerError, PlayerEventType, PresentationMode, TextTrack } from 'react-native-theoplayer';
import type { TimeRange } from '../timeranges/TimeRange';
import type { Event } from './Event';

/**
 * Dispatched when a player error occurs.
 *
 * @category Events
 * @category Player
 * @public
 */
export interface ErrorEvent extends Event<PlayerEventType.ERROR> {
  error: PlayerError;
}

/**
 * Dispatched when the player determines the duration and dimensions of the media resource.
 *
 * @category Events
 * @category Player
 * @public
 */
export interface LoadedMetadataEvent extends Event<PlayerEventType.LOADED_METADATA> {
  textTracks: TextTrack[];
  audioTracks: MediaTrack[];
  videoTracks: MediaTrack[];
  duration: number;
  selectedTextTrack: number | undefined;
  selectedVideoTrack: number | undefined;
  selectedAudioTrack: number | undefined;
}

/**
 * Dispatched when the current playback position changed as part of normal playback or in an especially interesting way,
 * for example discontinuously.
 *
 * @category Events
 * @category Player
 * @public
 */
export interface TimeUpdateEvent extends Event<PlayerEventType.TIME_UPDATE> {
  /**
   * The player's current time, in msecs.
   */
  readonly currentTime: number;

  /**
   * The player's current program date time, in msecs.
   */
  readonly currentProgramDateTime?: number;
}

/**
 * Dispatched when the player dimensions are updated.
 *
 * @category Events
 * @category Player
 * @public
 */
export interface DimensionChangeEvent extends Event<PlayerEventType.DIMENSION_CHANGE> {
  /**
   * The player's current width.
   */
  readonly width: number;

  /**
   * The player's current height.
   */
  readonly height: number;
}

/**
 * Dispatched when player is resized.
 *
 * @category Events
 * @category Player
 * @public
 *
 * @deprecated use {@link DimensionChangeEvent} instead. This event is set for removal in version 11.
 */
export interface ResizeEvent extends Event<PlayerEventType.RESIZE> {
  /**
   * The player's current width.
   */
  readonly width: number;

  /**
   * The player's current height.
   */
  readonly height: number;
}

/**
 * Dispatched when video is resized.
 *
 * @category Events
 * @category Player
 * @public
 */
export interface VideoResizeEvent extends Event<PlayerEventType.VIDEO_RESIZE> {
  /**
   * The video's current width.
   */
  readonly videoWidth: number;

  /**
   * The video's current height.
   */
  readonly videoHeight: number;
}

/**
 * Dispatched when the player's duration changes.
 *
 * @category Events
 * @category Player
 * @public
 */
export interface DurationChangeEvent extends Event<PlayerEventType.DURATION_CHANGE> {
  /**
   * The player's new duration, in msecs.
   */
  readonly duration: number;
}

/**
 * Provides additional context information during changes in presentation mode.
 *
 * @category Events
 * @category Player
 * @public
 */
export enum PresentationModeChangePipContext {
  /**
   * The PiP window was explicitly closed.
   */
  CLOSED = 'closed',

  /**
   * The PiP window was restored/maximized.
   */
  RESTORED = 'restored',

  /**
   * The app is transitioning to the PiP frame.
   *
   * @platform android
   */
  TRANSITIONING_TO_PIP = 'transitioning-to-pip',
}

/**
 * Provides additional context information during changes in PiP presentation mode.
 *
 * @category Events
 * @category Player
 * @public
 */
export interface PresentationModeChangeContext {
  /**
   * The PiP context for presentationMode change.
   */
  readonly pip: PresentationModeChangePipContext;
}

/**
 * Dispatched when the player changes its current presentation mode.
 *
 * @category Events
 * @category Player
 * @public
 */
export interface PresentationModeChangeEvent extends Event<PlayerEventType.PRESENTATIONMODE_CHANGE> {
  /**
   * The player's new presentationMode.
   */
  readonly presentationMode: PresentationMode;

  /**
   * The player's previous presentationMode.
   */
  readonly previousPresentationMode: PresentationMode;

  /**
   * The context for presentationMode change.
   */
  readonly context?: PresentationModeChangeContext;
}

/**
 * Dispatched when the player's playback rate changes.
 *
 * @category Events
 * @category Player
 * @public
 */
export interface RateChangeEvent extends Event<PlayerEventType.RATE_CHANGE> {
  /**
   * The player's new playback rate.
   */
  readonly playbackRate: number;
}

/**
 * Dispatched when the player's readystate changes.
 *
 * @category Events
 * @category Player
 * @public
 */
export interface ReadyStateChangeEvent extends Event<PlayerEventType.READYSTATE_CHANGE> {
  /**
   * The player's new ready state.
   */
  readonly readyState: number;
}

/**
 * Dispatched when the player's volume changes.
 *
 * @category Events
 * @category Player
 * @public
 */
export interface VolumeChangeEvent extends Event<PlayerEventType.VOLUME_CHANGE> {
  /**
   * The player's new volume.
   */
  readonly volume: number;

  /**
   * The player's muted state.
   */
  readonly muted: boolean;
}

/**
 * Dispatched when the player loaded media data.
 *
 * @category Events
 * @category Player
 * @public
 */
export interface ProgressEvent extends Event<PlayerEventType.PROGRESS> {
  /**
   * The ranges of the media resource that are seekable by the player.
   */
  readonly seekable: TimeRange[];

  /**
   * The ranges of the media resource that are buffered by the player.
   */
  readonly buffered: TimeRange[];
}

/**
 * Dispatched during playback when a segment is not found.
 *
 * @category Events
 * @category Player
 * @public
 */
export interface SegmentNotFoundEvent extends Event<PlayerEventType.SEGMENT_NOT_FOUND> {
  /**
   * Start time of the segment.
   */
  readonly segmentStartTime: number;

  /**
   * Descriptive error message.
   */
  readonly error: string;

  /**
   * Number of times the segment was retried.
   */
  readonly retryCount: number;
}

/**
 * Dispatched when the player has started seeking to a new position.
 *
 * @category Events
 * @category Player
 * @public
 */
export interface SeekingEvent extends Event<PlayerEventType.SEEKING> {
  /**
   * The player's current time.
   */
  readonly currentTime: number;
}

/**
 * Dispatched when the player has finished seeking to a new position.
 *
 * @category Events
 * @category Player
 * @public
 */
export interface SeekedEvent extends Event<PlayerEventType.SEEKED> {
  /**
   * The player's current time.
   */
  readonly currentTime: number;
}
