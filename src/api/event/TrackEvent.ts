import type { TextTrack } from '../track/TextTrack';
import type { TextTrackCue } from '../track/TextTrackCue';

export enum TrackListEventType {
  /**
   * Dispatched when track has been added to the track list.
   */
  AddTrack,

  /**
   * Dispatched when track has been removed from the track list.
   */
  RemoveTrack,
}

export interface TextTrackListEvent {
  /**
   * The type of text track list event.
   */
  readonly type: TrackListEventType;

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
