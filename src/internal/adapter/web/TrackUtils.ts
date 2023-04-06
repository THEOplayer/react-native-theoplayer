import type {
  MediaTrack as NativeMediaTrack,
  MediaTrackList as NativeMediaTrackList,
  Quality as NativeQuality,
  TextTrack as NativeTextTrack,
  TextTrackCue as NativeTextTrackCue,
  TextTracksList as NativeTextTrackList,
} from 'theoplayer';
import type { MediaTrack, TextTrack, TextTrackCue } from 'react-native-theoplayer';

export function fromNativeCue(cue: NativeTextTrackCue): TextTrackCue {
  return {
    id: cue.id,
    uid: cue.uid,
    startTime: 1e3 * cue.startTime,
    endTime: 1e3 * cue.endTime,
    content: cue.content,
  } as TextTrackCue;
}

export function fromNativeTextTrackList(tracks: NativeTextTrackList): TextTrack[] {
  return tracks.map((track) => fromNativeTextTrack(track));
}

export function fromNativeTextTrack(track: NativeTextTrack): TextTrack {
  const { id, uid, kind, label, language, mode, type, src, forced } = track;

  return {
    id,
    uid,
    kind,
    label,
    language,
    mode,
    type,
    src,
    forced,
    cues: track.cues ? track.cues.map((cue) => fromNativeCue(cue)) : [],
  } as TextTrack;
}

export function fromNativeMediaTrackList(tracks: NativeMediaTrackList): MediaTrack[] {
  return tracks.map((track) => fromNativeMediaTrack(track));
}

export function fromNativeMediaTrack(track: NativeMediaTrack): MediaTrack {
  const { id, uid, kind, label, language, activeQuality, qualities } = track;
  return {
    kind,
    label,
    language,
    id,
    uid,
    activeQuality,
    qualities,
  } as MediaTrack;
}

export function findNativeQualityByUid(mediaTrack: NativeMediaTrack, uid: number | undefined): NativeQuality | undefined {
  return mediaTrack.qualities.find((quality) => quality.uid === uid);
}

export function findNativeQualitiesByUid(mediaTrack: NativeMediaTrack | undefined, uid: number | number[] | undefined): NativeQuality[] | undefined {
  if (uid !== undefined && mediaTrack) {
    if (Array.isArray(uid)) {
      return mediaTrack.qualities.filter((quality) => uid.includes(quality.uid));
    } else {
      const quality = findNativeQualityByUid(mediaTrack, uid);
      return quality ? [quality] : undefined;
    }
  }
  return undefined;
}
