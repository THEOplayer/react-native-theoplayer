import type { MediaTrack, Quality, TextTrack, TextTrackCue } from 'react-native-theoplayer';
import { MediaTrackEventType, MediaTrackType, TextTrackEventType, TrackListEventType } from 'react-native-theoplayer';

export enum NativeTrackListEventType {
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

export interface NativeTrackListEvent {
  /**
   * The type of track list event.
   */
  readonly type: NativeTrackListEventType;
}

export interface NativeTextTrackListEvent extends NativeTrackListEvent {
  /**
   * The relevant text track.
   */
  readonly track: TextTrack;
}

export enum NativeTextTrackEventType {
  /**
   * Dispatched when cue has been added to the text track.
   */
  AddCue,

  /**
   * Dispatched when cue has been removed from the text track.
   */
  RemoveCue,

  /**
   * Dispatched when a cue of the track enters.
   */
  EnterCue,

  /**
   * Dispatched when a cue of the track exits.
   */
  ExitCue,
}

export interface NativeTextTrackEvent {
  /**
   * The type of text track event.
   */
  readonly type: NativeTextTrackEventType;

  /**
   * The text track's uid to which this cue belongs.
   */
  readonly trackUid: number;

  /**
   * The text track's cue.
   */
  readonly cue: TextTrackCue;
}

export enum NativeMediaTrackType {
  Audio,

  Video,
}

export interface NativeMediaTrackListEvent extends NativeTrackListEvent {
  /**
   * The relevant media track type, either {@link NativeMediaTrackType.Audio} or {@link NativeMediaTrackType.Video}.
   */
  readonly trackType: NativeMediaTrackType;

  /**
   * The relevant media track.
   */
  readonly track: MediaTrack;
}

export enum NativeMediaTrackEventType {
  /**
   * Dispatched when the media track's active quality changes.
   */
  ActiveQualityChanged,
}

export interface NativeMediaTrackEvent {
  /**
   * The type of media track event.
   */
  readonly type: NativeMediaTrackEventType;

  /**
   * The media track's type to which event belongs, either {@link MediaTrackType.Audio} or {@link MediaTrackType.Video}.
   */
  readonly trackType: NativeMediaTrackType;

  /**
   * The media track's uid to which event belongs.
   */
  readonly trackUid: number;

  /**
   * The affected media track's qualities.
   */
  readonly qualities?: Quality | Quality[];
}

export function toTrackListEventType(type: NativeTrackListEventType): TrackListEventType {
  switch (type) {
    case NativeTrackListEventType.AddTrack:
      return TrackListEventType.ADD_TRACK;
    case NativeTrackListEventType.ChangeTrack:
      return TrackListEventType.CHANGE_TRACK;
    case NativeTrackListEventType.RemoveTrack:
      return TrackListEventType.REMOVE_TRACK;
  }
}

export function toTextTrackEventType(type: NativeTextTrackEventType): TextTrackEventType {
  switch (type) {
    case NativeTextTrackEventType.AddCue:
      return TextTrackEventType.ADD_CUE;
    case NativeTextTrackEventType.RemoveCue:
      return TextTrackEventType.REMOVE_CUE;
    case NativeTextTrackEventType.EnterCue:
      return TextTrackEventType.ENTER_CUE;
    case NativeTextTrackEventType.ExitCue:
      return TextTrackEventType.EXIT_CUE;
  }
}

export function toMediaTrackType(type: NativeMediaTrackType): MediaTrackType {
  switch (type) {
    case NativeMediaTrackType.Audio:
      return MediaTrackType.AUDIO;
    case NativeMediaTrackType.Video:
      return MediaTrackType.VIDEO;
  }
}

export function toMediaTrackTypeEventType(type: NativeMediaTrackEventType): MediaTrackEventType {
  switch (type) {
    case NativeMediaTrackEventType.ActiveQualityChanged:
      return MediaTrackEventType.ACTIVE_QUALITY_CHANGED;
  }
}
