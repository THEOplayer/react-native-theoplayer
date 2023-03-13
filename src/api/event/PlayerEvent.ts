import type { MediaTrack, PlayerError, PlayerEventType, PresentationMode, TextTrack } from 'react-native-theoplayer';
import type { TimeRange } from '../timeranges/TimeRange';
import type { Event } from './Event';

export interface ErrorEvent extends Event<PlayerEventType.ERROR> {
  error: PlayerError;
}

export interface LoadedMetadataEvent extends Event<PlayerEventType.LOADED_METADATA> {
  textTracks: TextTrack[];
  audioTracks: MediaTrack[];
  videoTracks: MediaTrack[];
  duration: number;
  selectedTextTrack: number | undefined;
  selectedVideoTrack: number | undefined;
  selectedAudioTrack: number | undefined;
}

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

export interface DurationChangeEvent extends Event<PlayerEventType.DURATION_CHANGE> {
  /**
   * The player's new duration, in msecs.
   */
  readonly duration: number;
}

export type PresentationModeChangePipContext = 'closed' | 'restored';

export interface PresentationModeChangeContext {
  /**
   * The PiP context for presentationMode change.
   */
  readonly pip: PresentationModeChangePipContext;
}

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

export interface RateChangeEvent extends Event<PlayerEventType.RATE_CHANGE> {
  /**
   * The player's new playback rate.
   */
  readonly playbackRate: number;
}

export interface ReadyStateChangeEvent extends Event<PlayerEventType.READYSTATE_CHANGE> {
  /**
   * The player's new ready state.
   */
  readonly readyState: number;
}

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
