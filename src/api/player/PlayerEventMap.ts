import type { Event } from '../event/Event';
import type {
  DurationChangeEvent,
  ErrorEvent,
  LoadedMetadataEvent,
  ProgressEvent,
  RateChangeEvent,
  ReadyStateChangeEvent,
  SegmentNotFoundEvent,
  TimeUpdateEvent,
  PresentationModeChangeEvent,
  VolumeChangeEvent,
} from '../event/PlayerEvent';
import type { MediaTrackEvent, MediaTrackListEvent, TextTrackEvent, TextTrackListEvent } from '../event/TrackEvent';
import type { AdEvent } from '../event/AdEvent';
import type { CastEvent } from '../event/CastEvent';

export enum PlayerEventType {
  PLAY = 'play',
  CANPLAY = 'canplay',
  PLAYING = 'playing',
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
  RATE_CHANGE = 'ratechange',
  SEGMENT_NOT_FOUND = 'segmentnotfound',
  TEXT_TRACK_LIST = 'texttracklist',
  TEXT_TRACK = 'texttrack',
  MEDIA_TRACK_LIST = 'mediatracklist',
  MEDIA_TRACK = 'mediatrack',
  AD_EVENT = 'adevent',
  CAST_EVENT = 'castevent',
  VOLUME_CHANGE = 'volumechange',
  WAITING = 'waiting',
  PRESENTATIONMODE_CHANGE = 'presentationmodechange',
  DESTROY = 'destroy',
}

/**
 * The events dispatched by THEOplayer.
 *
 */
export interface PlayerEventMap {
  /**
   * Dispatched when the player can resume playback of the media data.
   */
  [PlayerEventType.CANPLAY]: Event<PlayerEventType.CANPLAY>;

  /**
   * Dispatched when the player's internal paused state changes to `false`.
   */
  [PlayerEventType.PLAY]: Event<PlayerEventType.PLAY>;

  /**
   * Dispatched when playback is ready to start after having been paused or delayed due to lack of media data.
   */
  [PlayerEventType.PLAYING]: Event<PlayerEventType.PLAYING>;

  /**
   * Dispatched when the presentationMode of the player changes.
   */
  [PlayerEventType.PRESENTATIONMODE_CHANGE]: PresentationModeChangeEvent;

  /**
   * Dispatched when the player's source changes.
   */
  [PlayerEventType.SOURCE_CHANGE]: Event<PlayerEventType.SOURCE_CHANGE>;

  /**
   * Dispatched when the player starts loading the manifest.
   */
  [PlayerEventType.LOAD_START]: Event<PlayerEventType.LOAD_START>;

  /**
   * Dispatched when the player determines the metadata for its source.
   */
  [PlayerEventType.LOADED_METADATA]: LoadedMetadataEvent;

  /**
   * Dispatched when the player can render the media data at the current playback position for the first time.
   */
  [PlayerEventType.LOADED_DATA]: Event<PlayerEventType.LOADED_DATA>;

  /**
   * Dispatched when the player's readyState has changed.
   */
  [PlayerEventType.READYSTATE_CHANGE]: ReadyStateChangeEvent;

  /**
   * Dispatched when the player's volume changes.
   */
  [PlayerEventType.VOLUME_CHANGE]: VolumeChangeEvent;

  /**
   * Dispatched when an error occurs.
   */
  [PlayerEventType.ERROR]: ErrorEvent;

  /**
   * Dispatched each time the player has loaded media data.
   */
  [PlayerEventType.PROGRESS]: ProgressEvent;

  /**
   * Dispatched when the player's internal paused state changes to `true`.
   */
  [PlayerEventType.PAUSE]: Event<PlayerEventType.PAUSE>;

  /**
   * Dispatched when a seek operation starts and the player is seeking a new position.
   */
  [PlayerEventType.SEEKING]: Event<PlayerEventType.SEEKING>;

  /**
   * Dispatched when a seek operation completed and the current playback position has changed.
   */
  [PlayerEventType.SEEKED]: Event<PlayerEventType.SEEKED>;

  /**
   * Dispatched when playback has stopped because the end of the media was reached or because
   * no further data is available.
   */
  [PlayerEventType.ENDED]: Event<PlayerEventType.ENDED>;

  /**
   * Dispatched when playback has stopped because the next frame is not available, but the
   * player expects that frame to become available in due course.
   */
  [PlayerEventType.WAITING]: Event<PlayerEventType.WAITING>;

  /**
   * Dispatched each time the current playback position changed.
   */
  [PlayerEventType.TIME_UPDATE]: TimeUpdateEvent;

  /**
   * Dispatched when the player's duration attribute has been updated.
   */
  [PlayerEventType.DURATION_CHANGE]: DurationChangeEvent;

  /**
   * Dispatched when the player's playbackRate changes.
   */
  [PlayerEventType.RATE_CHANGE]: RateChangeEvent;

  /**
   * Dispatched when a segment can not be found.
   *
   * @remarks
   * <br/> - Only dispatched on DASH streams.
   */
  [PlayerEventType.SEGMENT_NOT_FOUND]: SegmentNotFoundEvent;

  /**
   * Dispatched when a text track list event occurs.
   */
  [PlayerEventType.TEXT_TRACK_LIST]: TextTrackListEvent;

  /**
   * Dispatched when a text track event occurs.
   */
  [PlayerEventType.TEXT_TRACK]: TextTrackEvent;

  /**
   * Dispatched when a media track list event occurs.
   */
  [PlayerEventType.MEDIA_TRACK_LIST]: MediaTrackListEvent;

  /**
   * Dispatched when a media track event occurs.
   */
  [PlayerEventType.MEDIA_TRACK]: MediaTrackEvent;

  /**
   * Dispatched when an ad event occurs.
   */
  [PlayerEventType.AD_EVENT]: AdEvent;

  /**
   * Dispatched when a cast event occurs, either for Chromecast or Airplay.
   */
  [PlayerEventType.CAST_EVENT]: CastEvent;

  /**
   * Dispatched when the player will be destroyed.
   */
  [PlayerEventType.DESTROY]: Event<PlayerEventType.DESTROY>;
}
