import type { Event } from '../event/Event';
import type {
  BufferingChangeEvent,
  DurationChangeEvent,
  ErrorEvent,
  FullscreenEvent,
  LoadedMetadataEvent,
  ProgressEvent,
  ReadyStateChangeEvent,
  SegmentNotFoundEvent,
  TimeUpdateEvent,
} from '../event/PlayerEvent';
import type { MediaTrackEvent, MediaTrackListEvent, TextTrackEvent, TextTrackListEvent } from '../event/TrackEvent';
import type { AdEvent } from '../event/AdEvent';
import type { CastEvent } from '../event/CastEvent';

export enum PlayerEventType {
  PLAY = 'play',
  PLAYING = 'playing',
  FULLSCREEN = 'fullscreen',
  BUFFERING_CHANGE = 'bufferingchange',
  SOURCE_CHANGE = 'sourcechange',
  LOAD_START = 'loadstart',
  LOADED_METADATA = 'loadedmetadata',
  LOADED_DATA = 'loadeddata',
  READYSTATE_CHANGE = 'readystatechange',
  ERROR = 'error',
  PROGRESS = 'progress',
  PAUSE = 'pause',
  SEEKING = 'seeking',
  SEEKED = 'seeked',
  ENDED = 'ended',
  TIME_UPDATE = 'timeupdate',
  DURATION_CHANGE = 'durationchange',
  SEGMENT_NOT_FOUND = 'segmentnotfound',
  TEXT_TRACK_LIST = 'texttracklist',
  TEXT_TRACK = 'texttrack',
  MEDIA_TRACK_LIST = 'mediatracklist',
  MEDIA_TRACK = 'mediatrack',
  AD_EVENT = 'adevent',
  CAST_EVENT = 'castevent',
}

/**
 * The events fired by the {@link THEOplayerViewProps}.
 *
 */
export interface PlayerEventMap {
  [PlayerEventType.PLAY]: Event<PlayerEventType.PLAY>;

  [PlayerEventType.PLAYING]: Event<PlayerEventType.PLAYING>;

  [PlayerEventType.FULLSCREEN]: FullscreenEvent;

  [PlayerEventType.BUFFERING_CHANGE]: BufferingChangeEvent;

  [PlayerEventType.SOURCE_CHANGE]: Event<PlayerEventType.SOURCE_CHANGE>;

  [PlayerEventType.LOAD_START]: Event<PlayerEventType.LOAD_START>;

  [PlayerEventType.LOADED_METADATA]: LoadedMetadataEvent;

  [PlayerEventType.LOADED_DATA]: Event<PlayerEventType.LOADED_DATA>;

  /**
   * Invoked when the player's readyState has changed.
   */
  [PlayerEventType.READYSTATE_CHANGE]: ReadyStateChangeEvent;

  /**
   * Invoked when an error occurs.
   */
  [PlayerEventType.ERROR]: ErrorEvent;

  /**
   * Invoked each time the player has loaded media data.
   */
  [PlayerEventType.PROGRESS]: ProgressEvent;

  /**
   * Invoked when the player's internal paused state changes to `true`.
   */
  [PlayerEventType.PAUSE]: Event<PlayerEventType.PAUSE>;

  /**
   * Invoked when a seek operation starts and the player is seeking a new position.
   */
  [PlayerEventType.SEEKING]: Event<PlayerEventType.SEEKING>;

  /**
   * Invoked when a seek operation completed and the current playback position has changed.
   */
  [PlayerEventType.SEEKED]: Event<PlayerEventType.SEEKED>;

  /**
   * Invoked when playback has stopped because the end of the media was reached or because
   * no further data is available.
   */
  [PlayerEventType.ENDED]: Event<PlayerEventType.ENDED>;

  /**
   * Invoked each time the current playback position changed.
   */
  [PlayerEventType.TIME_UPDATE]: TimeUpdateEvent;

  /**
   * Invoked when the player's duration attribute has been updated.
   */
  [PlayerEventType.DURATION_CHANGE]: DurationChangeEvent;

  /**
   * Invoked when a segment can not be found.
   *
   * @remarks
   * <br/> - Only dispatched on DASH streams.
   */
  [PlayerEventType.SEGMENT_NOT_FOUND]: SegmentNotFoundEvent;

  /**
   * Invoked when a text track list event occurs.
   */
  [PlayerEventType.TEXT_TRACK_LIST]: TextTrackListEvent;

  /**
   * Invoked when a text track event occurs.
   */
  [PlayerEventType.TEXT_TRACK]: TextTrackEvent;

  /**
   * Invoked when a media track list event occurs.
   */
  [PlayerEventType.MEDIA_TRACK_LIST]: MediaTrackListEvent;

  /**
   * Invoked when a media track event occurs.
   */
  [PlayerEventType.MEDIA_TRACK]: MediaTrackEvent;

  /**
   * Invoked when an ad event occurs.
   */
  [PlayerEventType.AD_EVENT]: AdEvent;

  /**
   * Invoked when a cast event occurs, either for Chromecast or Airplay.
   */
  [PlayerEventType.CAST_EVENT]: CastEvent;
}
