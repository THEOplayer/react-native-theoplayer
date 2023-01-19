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
  VolumeChangeEvent,
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
  VOLUME_CHANGE = 'volumechange',
}

/**
 * The events fired by THEOplayer.
 *
 */
export interface PlayerEventMap {
  /**
   * Fired when the player's internal paused state changes to `false`.
   */
  [PlayerEventType.PLAY]: Event<PlayerEventType.PLAY>;

  /**
   * Fired when playback is ready to start after having been paused or delayed due to lack of media data.
   */
  [PlayerEventType.PLAYING]: Event<PlayerEventType.PLAYING>;

  /**
   * Fired when the player.
   */
  [PlayerEventType.FULLSCREEN]: FullscreenEvent;

  // TODO Remove this
  [PlayerEventType.BUFFERING_CHANGE]: BufferingChangeEvent;

  /**
   * Fired when the player's source changes.
   */
  [PlayerEventType.SOURCE_CHANGE]: Event<PlayerEventType.SOURCE_CHANGE>;

  /**
   * Fired when the player starts loading the manifest.
   */
  [PlayerEventType.LOAD_START]: Event<PlayerEventType.LOAD_START>;

  /**
   * Fired when the player determines the metadata for its source.
   */
  [PlayerEventType.LOADED_METADATA]: LoadedMetadataEvent;

  /**
   * Fired when the player can render the media data at the current playback position for the first time.
   */
  [PlayerEventType.LOADED_DATA]: Event<PlayerEventType.LOADED_DATA>;

  /**
   * Fired when the player's readyState has changed.
   */
  [PlayerEventType.READYSTATE_CHANGE]: ReadyStateChangeEvent;

  /**
   * Fired when the player's volume changes.
   */
  [PlayerEventType.VOLUME_CHANGE]: VolumeChangeEvent;

  /**
   * Fired when an error occurs.
   */
  [PlayerEventType.ERROR]: ErrorEvent;

  /**
   * Fired each time the player has loaded media data.
   */
  [PlayerEventType.PROGRESS]: ProgressEvent;

  /**
   * Fired when the player's internal paused state changes to `true`.
   */
  [PlayerEventType.PAUSE]: Event<PlayerEventType.PAUSE>;

  /**
   * Fired when a seek operation starts and the player is seeking a new position.
   */
  [PlayerEventType.SEEKING]: Event<PlayerEventType.SEEKING>;

  /**
   * Fired when a seek operation completed and the current playback position has changed.
   */
  [PlayerEventType.SEEKED]: Event<PlayerEventType.SEEKED>;

  /**
   * Fired when playback has stopped because the end of the media was reached or because
   * no further data is available.
   */
  [PlayerEventType.ENDED]: Event<PlayerEventType.ENDED>;

  /**
   * Fired each time the current playback position changed.
   */
  [PlayerEventType.TIME_UPDATE]: TimeUpdateEvent;

  /**
   * Fired when the player's duration attribute has been updated.
   */
  [PlayerEventType.DURATION_CHANGE]: DurationChangeEvent;

  /**
   * Fired when a segment can not be found.
   *
   * @remarks
   * <br/> - Only dispatched on DASH streams.
   */
  [PlayerEventType.SEGMENT_NOT_FOUND]: SegmentNotFoundEvent;

  /**
   * Fired when a text track list event occurs.
   */
  [PlayerEventType.TEXT_TRACK_LIST]: TextTrackListEvent;

  /**
   * Fired when a text track event occurs.
   */
  [PlayerEventType.TEXT_TRACK]: TextTrackEvent;

  /**
   * Fired when a media track list event occurs.
   */
  [PlayerEventType.MEDIA_TRACK_LIST]: MediaTrackListEvent;

  /**
   * Fired when a media track event occurs.
   */
  [PlayerEventType.MEDIA_TRACK]: MediaTrackEvent;

  /**
   * Fired when an ad event occurs.
   */
  [PlayerEventType.AD_EVENT]: AdEvent;

  /**
   * Fired when a cast event occurs, either for Chromecast or Airplay.
   */
  [PlayerEventType.CAST_EVENT]: CastEvent;
}
