import type {
  MediaTrack,
  PlayerError,
  PlayerVersion,
  PresentationMode,
  PresentationModeChangeContext,
  TextTrack,
  TimeRange,
} from 'react-native-theoplayer';
import type { NativePlayerState } from '../../NativePlayerState';

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

export interface NativeSeekingEvent {
  /**
   * The player's currentTime.
   */
  readonly currentTime: number;
}

export interface NativeSeekedEvent {
  /**
   * The player's currentTime.
   */
  readonly currentTime: number;
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

export interface NativeDimensionChangeEvent {
  /**
   * The width of the player.
   */
  readonly width: number;

  /**
   * The height of the player.
   */
  readonly height: number;
}

export interface NativeVideoResizeEvent {
  /**
   * The width of the video.
   */
  readonly videoWidth: number;

  /**
   * The height of the video.
   */
  readonly videoHeight: number;
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

export interface NativePlayerStateEvent {
  readonly version: PlayerVersion;

  readonly state: NativePlayerState;
}
