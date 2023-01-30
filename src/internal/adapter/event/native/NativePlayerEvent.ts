import type { MediaTrack, PlayerError, TextTrack, TimeRange } from 'react-native-theoplayer';

export interface NativeErrorEvent {
  error: PlayerError;
}

export interface NativeLoadedMetadataEvent {
  textTracks: TextTrack[];
  audioTracks: MediaTrack[];
  videoTracks: MediaTrack[];
  duration: number;
  selectedTextTrack: number | undefined;
  selectedVideoTrack: number | undefined;
  selectedAudioTrack: number | undefined;
}

export interface NativeTimeUpdateEvent {
  /**
   * The player's current time, in msecs.
   */
  readonly currentTime: number;

  /**
   * The player's current program date time, in msecs.
   */
  readonly currentProgramDateTime?: number;
}

export interface NativeDurationChangeEvent {
  /**
   * The player's new duration, in msecs.
   */
  readonly duration: number;
}

export interface NativeRateChangeEvent {
  /**
   * The player's new playbackRate.
   */
  readonly playbackRate: number;
}

export interface NativeReadyStateChangeEvent {
  /**
   * The player's new ready state.
   */
  readonly readyState: number;
}

export interface NativeProgressEvent {
  /**
   * The ranges of the media resource that are seekable by the player.
   */
  readonly seekable: TimeRange[];
}

export interface NativeSegmentNotFoundEvent {
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
