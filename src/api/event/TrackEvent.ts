import type { TextTrack } from '../track/TextTrack';
import type { TextTrackCue } from '../track/TextTrackCue';
import type { MediaTrack } from '../track/MediaTrack';
import type { Quality } from '../track/Quality';

export enum TrackListEventType {
  /**
   * Dispatched when track has been added to the track list.
   */
  AddTrack,

  /**
   * Dispatched when track has been removed from the track list.
   */
  RemoveTrack,

  /**
   * Fired when a track has been changed.
   */
  ChangeTrack,
}

export interface TrackListEvent {
  /**
   * The type of track list event.
   */
  readonly type: TrackListEventType;
}

export interface TextTrackListEvent extends TrackListEvent {
  /**
   * The relevant text track.
   */
  readonly track: TextTrack;
}

export enum TextTrackEventType {
  /**
   * Dispatched when cue has been added to the text track.
   */
  AddCue,

  /**
   * Dispatched when cue has been removed from the text track.
   */
  RemoveCue,
}

export interface TextTrackEvent {
  /**
   * The type of text track event.
   */
  readonly type: TextTrackEventType;

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
  Audio,

  Video,
}

export interface MediaTrackListEvent extends TrackListEvent {
  /**
   * The relevant media track type, either {@link MediaTrackType.Audio} or {@link MediaTrackType.Video}.
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
  ActiveQualityChanged,
}

export interface MediaTrackEvent {
  /**
   * The type of media track event.
   */
  readonly type: MediaTrackEventType;

  /**
   * The media track's type to which event belongs, either {@link MediaTrackType.Audio} or {@link MediaTrackType.Video}.
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
