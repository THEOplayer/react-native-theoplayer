import type { MediaTrack, PlayerError, TextTrack } from 'react-native-theoplayer';
import type { TimeRange } from '../timeranges/TimeRange';

export interface ErrorEvent {
  error: PlayerError;
}

export interface LoadedMetadataEvent {
  textTracks: TextTrack[];
  audioTracks: MediaTrack[];
  videoTracks: MediaTrack[];
  duration: number;
  selectedTextTrack: number | undefined;
  selectedVideoTrack: number | undefined;
  selectedAudioTrack: number | undefined;
}

export interface TimeUpdateEvent {
  /**
   * The player's current time, in msecs.
   */
  readonly currentTime: number;

  /**
   * The player's current program date time, in msecs.
   */
  readonly currentProgramDateTime?: number;
}

export interface DurationChangeEvent {
  /**
   * The player's new duration, in msecs.
   */
  readonly duration: number;
}

export interface ReadyStateChangeEvent {
  /**
   * The player's new ready state.
   */
  readonly readyState: number;
}

export interface ProgressEvent {
  /**
   * The ranges of the media resource that are seekable by the player.
   */
  readonly seekable: TimeRange[];
}

export interface SegmentNotFoundEvent {
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
