import type { Int32 } from 'react-native/Libraries/Types/CodegenTypes';
import { MediaTrackEventType, MediaTrackType, TextTrackEventType, TrackListEventType } from 'react-native-theoplayer';

export function toTrackListEventType(type: Int32): TrackListEventType {
  switch (type) {
    case 0 /*AddTrack*/:
      return TrackListEventType.ADD_TRACK;
    case 1 /*ChangeTrack*/:
      return TrackListEventType.CHANGE_TRACK;
    case 2 /*RemoveTrack*/:
      return TrackListEventType.REMOVE_TRACK;
    default:
      throw Error(`Unknown TrackListEventType: ${type}`);
  }
}

export function toTextTrackEventType(type: Int32): TextTrackEventType {
  switch (type) {
    case 0 /*AddCue*/:
      return TextTrackEventType.ADD_CUE;
    case 1 /*RemoveCue*/:
      return TextTrackEventType.REMOVE_CUE;
    case 2 /*EnterCue*/:
      return TextTrackEventType.ENTER_CUE;
    case 3 /*ExitCue*/:
      return TextTrackEventType.EXIT_CUE;
    default:
      throw Error(`Unknown TrackEventType: ${type}`);
  }
}

export function toMediaTrackType(type: Int32): MediaTrackType {
  switch (type) {
    case 0 /*Audio*/:
      return MediaTrackType.AUDIO;
    case 1 /*Video*/:
      return MediaTrackType.VIDEO;
    default:
      throw Error(`Unknown MediaTrackType: ${type}`);
  }
}

export function toMediaTrackTypeEventType(type: Int32): MediaTrackEventType {
  switch (type) {
    case 0 /*ActiveQualityChanged*/:
      return MediaTrackEventType.ACTIVE_QUALITY_CHANGED;
    default:
      throw Error(`Unknown MediaTrackEventType: ${type}`);
  }
}
