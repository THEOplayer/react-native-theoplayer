import type { MediaTrack, TextTrack } from 'react-native-theoplayer';
import { TrackListEventType, VideoQuality } from 'react-native-theoplayer';
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

export function getVideoQualityLabel(quality: VideoQuality | undefined): string {
  if (!quality) {
    return 'auto';
  }
  if (quality.label && quality.label !== '') {
    return quality.label;
  }
  let label = '';
  if (quality.height) {
    label = quality.height + 'p';
  }
  if (!quality.bandwidth) {
    return label;
  }
  let bandwidth;
  if (quality.bandwidth > 1e7) {
    bandwidth = (quality.bandwidth / 1e6).toFixed(0) + 'Mbps';
  } else if (quality.bandwidth > 1e6) {
    bandwidth = (quality.bandwidth / 1e6).toFixed(1) + 'Mbps';
  } else {
    bandwidth = (quality.bandwidth / 1e3).toFixed(0) + 'kbps';
  }
  const isHD = quality.height ? quality.height >= 720 : false;
  return `${label} - ${bandwidth} ${isHD ? '(HD)' : ''}`;
}
