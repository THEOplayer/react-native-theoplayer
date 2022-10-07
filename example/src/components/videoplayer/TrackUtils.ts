import type { MediaTrack, TextTrack } from 'react-native-theoplayer';
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
