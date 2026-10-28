import type { MediaTrack, MediaTrackKind } from '../index';

type Assert<T extends true> = T;

export type MediaTrackKindChecks = [
  Assert<'main' | 'alternative' extends MediaTrackKind ? true : false>,
  Assert<'descriptions' | 'description' | 'main-desc' extends MediaTrackKind ? true : false>,
  Assert<'commentary' | 'translation' | 'captions' | 'sign' | 'subtitles' | '' extends MediaTrackKind ? true : false>,
  Assert<'vendor-custom' extends MediaTrackKind ? true : false>,
  Assert<string extends MediaTrackKind ? true : false>,
  Assert<MediaTrackKind extends string ? true : false>,
  Assert<string extends MediaTrack['kind'] ? true : false>,
  Assert<MediaTrack['kind'] extends MediaTrackKind ? true : false>,
  Assert<Extract<number | boolean | null | undefined | object, MediaTrackKind> extends never ? true : false>,
];
