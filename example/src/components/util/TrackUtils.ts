import type { MediaTrack, TextTrack } from 'react-native-theoplayer';
import { TrackListEventType } from 'react-native-theoplayer';
import { getISO639LanguageByCode } from '../../utils/language/Language';

export function getTrackLabel(track: MediaTrack | TextTrack): string {
  if (track.label) {
    return track.label;
  }
  const languageCode: string = track.language;
  if (languageCode) {
    const iso639Language = getISO639LanguageByCode(languageCode);
    if (iso639Language) {
      return iso639Language.local;
    }
  }
  return languageCode || '';
}

export function stringFromTextTrackListEvent(type: TrackListEventType): string {
  switch (type) {
    case TrackListEventType.ADD_TRACK:
      return 'AddTrack';
    case TrackListEventType.REMOVE_TRACK:
      return 'RemoveTrack';
    case TrackListEventType.CHANGE_TRACK:
      return 'ChangeTrack';
  }
}

/**
 * Retain renderable tracks.
 * https://html.spec.whatwg.org/multipage/embedded-content.html#text-track-showing
 */
export function filterRenderableTracks(textTracks: TextTrack[]): TextTrack[] {
  return textTracks.filter((textTrack) => textTrack.kind === 'subtitles' || textTrack.kind === 'captions');
}
