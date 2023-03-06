import type { MediaTrack, PlayerError, PresentationMode, PresentationModeChangeContext, TextTrack, TimeRange } from 'react-native-theoplayer';

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

export interface NativeVolumeChangeEvent {
  /**
   * The player's current volume.
   */
  readonly volume: number;

  /**
   * The player's current mute state.
   */
  readonly muted: boolean;
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

export interface NativePresentationModeChangeEvent {
  /**
   * The player's new presentation mode.
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

export interface NativeProgressEvent {
  /**
   * The ranges of the media resource that are seekable by the player.
   */
  readonly seekable: TimeRange[];

  /**
   * The ranges of the media resource that are buffered by the player.
   */
  readonly buffered: TimeRange[];
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
