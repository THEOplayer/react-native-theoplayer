import type { TextTrack } from '../track/TextTrack';
import type { TextTrackCue } from '../track/TextTrackCue';
import type { MediaTrack } from '../track/MediaTrack';
import type { Quality } from '../track/Quality';
import type { Event } from './Event';
import type { PlayerEventType } from '../player/PlayerEventMap';

export enum TrackListEventType {
  /**
   * Dispatched when track has been added to the track list.
   */
  ADD_TRACK = 'addtrack',

  /**
   * Dispatched when track has been removed from the track list.
   */
  REMOVE_TRACK = 'removetrack',

  /**
   * Fired when a track has been changed.
   */
  CHANGE_TRACK = 'changetrack',
}

export interface TextTrackListEvent extends Event<PlayerEventType.TEXT_TRACK_LIST> {
  readonly subType: TrackListEventType;
  /**
   * The relevant text track.
   */
  readonly track: TextTrack;
}

export enum TextTrackEventType {
  /**
   * Dispatched when cue has been added to the text track.
   */
  ADD_CUE = 'addcue',

  /**
   * Dispatched when cue has been removed from the text track.
   */
  REMOVE_CUE = 'removecue',

  /**
   * Dispatched when a cue of the track enters.
   */
  ENTER_CUE = 'entercue',

  /**
   * Dispatched when a cue of the track exits.
   */
  EXIT_CUE = 'exitcue',
}

export interface TextTrackEvent extends Event<PlayerEventType.TEXT_TRACK> {
  readonly subType: TextTrackEventType;
  /**
   * The text track's uid to which this cue belongs.
   */
  readonly trackUid: number;

  /**
   * The text track's cue.
   */
  readonly cue: TextTrackCue;
}

export enum MediaTrackType {
  AUDIO = 'audio',

  VIDEO = 'video',
}

export interface MediaTrackListEvent extends Event<PlayerEventType.MEDIA_TRACK_LIST> {
  readonly subType: TrackListEventType;
  /**
   * The relevant media track type, either {@link MediaTrackType.AUDIO} or {@link MediaTrackType.VIDEO}.
   */
  readonly trackType: MediaTrackType;

  /**
   * The relevant media track.
   */
  readonly track: MediaTrack;
}

export enum MediaTrackEventType {
  /**
   * Dispatched when the media track's active quality changes.
   */
  ACTIVE_QUALITY_CHANGED = 'activequalitychanged',
}

export interface MediaTrackEvent extends Event<PlayerEventType.MEDIA_TRACK> {
  readonly subType: MediaTrackEventType;
  /**
   * The media track's type to which event belongs, either {@link MediaTrackType.AUDIO} or {@link MediaTrackType.VIDEO}.
   */
  readonly trackType: MediaTrackType;

  /**
   * The media track's uid to which event belongs.
   */
  readonly trackUid: number;

  /**
   * The affected media track's qualities.
   */
  readonly qualities?: Quality | Quality[];
}
