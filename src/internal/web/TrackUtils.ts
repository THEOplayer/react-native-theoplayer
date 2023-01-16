import type {
  TextTrackCue as NativeTextTrackCue,
  TextTrack as NativeTextTrack,
  MediaTrack as NativeMediaTrack,
  Quality as NativeQuality,
} from 'theoplayer';
import type { TextTrack, TextTrackCue, MediaTrack } from '@wouterds/react-native-theoplayer';

export function fromNativeCue(cue: NativeTextTrackCue): TextTrackCue {
  return {
    id: cue.id,
    uid: cue.uid,
    startTime: 1e3 * cue.startTime,
    endTime: 1e3 * cue.endTime,
    content: cue.content,
  } as TextTrackCue;
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

export function fromNativeMediaTrack(track: NativeMediaTrack): MediaTrack {
  const { id, uid, kind, label, language, activeQuality, qualities, targetQuality } = track;

  return {
    kind,
    label,
    language,
    id,
    uid,
    activeQuality,
    qualities,
    targetQuality,
  } as MediaTrack;
}

export function findNativeQualityByUid(mediaTrack: NativeMediaTrack, uid: number | undefined): NativeQuality | undefined {
  return mediaTrack.qualities.find((quality) => quality.uid === uid);
}

export function findNativeQualitiesByUid(mediaTrack: NativeMediaTrack | undefined, uid: number | number[] | undefined): NativeQuality[] | undefined {
  if (uid && mediaTrack) {
    if (Array.isArray(uid)) {
      return mediaTrack.qualities.filter((quality) => uid.includes(quality.uid));
    } else {
      const quality = findNativeQualityByUid(mediaTrack, uid);
      return quality ? [quality] : undefined;
    }
  }
  return undefined;
}
