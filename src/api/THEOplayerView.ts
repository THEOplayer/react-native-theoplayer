import type { SourceDescription } from './source/SourceDescription';
import type { StyleProp, ViewStyle } from 'react-native';
import type {
  DurationChangeEvent,
  ErrorEvent,
  LoadedMetadataEvent,
  ReadyStateChangeEvent,
  TimeUpdateEvent,
  ProgressEvent,
  SegmentNotFoundEvent,
} from './event/PlayerEvent';
import type { TextTrackEvent, TextTrackListEvent } from './event/TrackEvent';
import type { HostComponent } from 'react-native';
import type { PlayerConfiguration } from './config/PlayerConfiguration';

export interface THEOplayerViewProps {
  /**
   * The player configuration with THEOplayer license.
   */
  config?: PlayerConfiguration;

  /**
   * A source description that determines the current media resource.
   */
  source: SourceDescription;

  /**
   * Used to set the player's paused state.
   *
   * @remarks
   * <br/> - If paused is initially set to `true`, play-out will start once the source is set.
   */
  paused?: boolean;

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
  playbackRate?: number;

  /**
   * Used to set the volume of the audio.
   *
   * @remarks
   * <br/> - Volume is represented by a floating point number between `0.0` and `1.0`.
   */
  volume?: number;

  /**
   * Determines whether audio is muted.
   */
  muted?: boolean;

  /**
   * Determines whether the player is currently playing in fullscreen.
   */
  fullscreen?: boolean;

  /**
   * Used to set the current selected text track by passing its `uid`, or `null` to select none.
   */
  selectedTextTrack?: number | null;

  /**
   * Used to set the current selected video track by passing its `uid`, or `null` to select none.
   */
  selectedVideoTrack?: number | null;

  /**
   * Used to set the current selected audio track by passing its `uid`, or `null` to select none.
   */
  selectedAudioTrack?: number | null;

  /**
   * The style applied to the player view.
   */
  style?: StyleProp<ViewStyle>;

  /**
   * Invoked before the player goes to fullscreen.
   */
  onFullscreenPlayerWillPresent?: () => void;

  /**
   * Invoked after the player went to fullscreen.
   */
  onFullscreenPlayerDidPresent?: () => void;

  /**
   * Invoked before the player returns from fullscreen.
   */
  onFullscreenPlayerWillDismiss?: () => void;

  /**
   * Invoked after the player returned from fullscreen.
   */
  onFullscreenPlayerDidDismiss?: () => void;

  /**
   * Invoked when the player's buffering state has changed.
   *
   * @remarks
   * <br/> - The `isBuffering` value is typically coupled to showing/hiding a loading indicator.
   *
   * @param isBuffering A value that indicates whether the player is buffering.
   */
  onBufferingStateChange?: (isBuffering: boolean) => void;

  /**
   * Invoked when the player receives a new source description.
   */
  onSourceChange?: () => void;

  /**
   * Invoked when the player starts loading the manifest.
   */
  onLoadStart?: () => void;

  /**
   * Invoked when the player has determined the duration and dimensions of the
   * media resource, and the text and media tracks are ready.
   */
  onLoadedMetadata?: (event: LoadedMetadataEvent) => void;

  /**
   * Invoked when the player can render the media data at the current playback position for the first time.
   */
  onLoadedData?: () => void;

  /**
   * Invoked when the player's readyState has changed.
   */
  onReadyStateChange?: (event: ReadyStateChangeEvent) => void;

  /**
   * Invoked when an error occurs.
   */
  onError?: (event: ErrorEvent) => void;

  /**
   * Invoked each time the player has loaded media data.
   */
  onProgress?: (event: ProgressEvent) => void;

  /**
   * Invoked when the player's internal paused state changes to `false`.
   */
  onPlay?: () => void;

  /**
   * Invoked when playback is ready to start after having been paused or delayed due to
   * lack of media data.
   */
  onPlaying?: () => void;

  /**
   * Invoked when the player's internal paused state changes to `true`.
   */
  onPause?: () => void;

  /**
   * Invoked when a seek operation starts and the player is seeking a new position.
   */
  onSeeking?: () => void;

  /**
   * Invoked when a seek operation completed and the current playback position has changed
   */
  onSeeked?: () => void;

  /**
   * Invoked when playback has stopped because the end of the media was reached or because
   * no further data is available.
   */
  onEnded?: () => void;

  /**
   * Invoked when the current playback position changed.
   */
  onTimeUpdate?: (event: TimeUpdateEvent) => void;

  /**
   * Invoked when the player's duration attribute has been updated.
   */
  onDurationChange?: (event: DurationChangeEvent) => void;

  /**
   * Invoked when a segment can not be found.
   *
   * @remarks
   * <br/> - Only dispatched on DASH streams.
   */
  onSegmentNotFound?: (event: SegmentNotFoundEvent) => void;

  /**
   * Invoked when a text track list event occurs.
   */
  onTextTrackListEvent?: (event: TextTrackListEvent) => void;

  /**
   * Invoked when a text track event occurs.
   */
  onTextTrackEvent?: (event: TextTrackEvent) => void;
}

export interface THEOplayerViewComponent extends HostComponent<THEOplayerViewProps> {
  /**
   * Seek to a new position.
   *
   * @param seekTime - new time, in milliseconds.
   */
  seek: (seekTime: number) => void;
}
