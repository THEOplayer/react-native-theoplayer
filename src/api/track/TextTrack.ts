import type { Track } from './Track';
import type { TextTrackCue } from './TextTrackCue';

/**
 * The content type of a text track, represented by a value from the following list:
 * <br/> - `'srt'`: The track contains SRT (SubRip Text) content.
 * <br/> - `'ttml'`: The track contains TTML (Timed Text Markup Language) content.
 * <br/> - `'webvtt'`: The track contains WebVTT (Web Video Text Tracks) content.
 * <br/> - `'emsg'`: The track contains emsg (Event Message) content.
 * <br/> - `'eventstream'`: The track contains Event Stream content.
 * <br/> - `'id3'`: The track contains ID3 content.
 * <br/> - `'cea608'`: The track contains CEA608 content.
 * <br/> - `'daterange'`: The track contains HLS EXT-X-DATERANGE content.
 *
 * @category Media and Text Tracks
 * @public
 */
export enum TextTrackType {
  cea608 = 'cea608',
  id3 = 'id3',
  srt = 'srt',
  ttml = 'ttml',
  webvtt = 'webvtt',
  daterange = 'daterange',
  eventstream = 'eventstream',
  emsg = 'emsg',
}

/**
 * The kind of the text track, represented by a value from the following list:
 * <br/> - `'subtitles'`: The track contains subtitles.
 * <br/> - `'captions'`: The track contains closed captions, a translation of dialogue and sound effects.
 * <br/> - `'descriptions'`: The track contains descriptions, a textual description of the video.
 * <br/> - `'chapters'`: The track contains chapter titles.
 * <br/> - `'metadata'`: The track contains metadata. This track will not serve display purposes.
 *
 * @category Media and Text Tracks
 * @public
 */
export enum TextTrackKind {
  captions = 'captions',
  chapters = 'chapters',
  descriptions = 'descriptions',
  metadata = 'metadata',
  subtitles = 'subtitles',
  thumbnails = 'thumbnails',
}

/**
 * The mode of the text track, represented by a value from the following list:
 * <br/> - `'disabled'`: The track is disabled.
 * <br/> - `'hidden'`: The track is hidden.
 * <br/> - `'showing'`: The track is showing.
 *
 * @remarks
 * <br/> - A disabled track is not displayed and exposes no active cues, nor fires cue events.
 * <br/> - A hidden track is not displayed but exposes active cues and fires cue events.
 * <br/> - A showing track is displayed, exposes active cues and fires cue events.
 *
 * @category Media and Text Tracks
 * @public
 */
export enum TextTrackMode {
  disabled = 'disabled',
  showing = 'showing',
  hidden = 'hidden',
}

/**
 * Represents a text track of a media resource.
 *
 * @category Media and Text Tracks
 * @public
 */
export interface TextTrack extends Track {
  /**
   * The kind of the text track, represented by a value from the following list:
   * <br/> - `'subtitles'`: The track contains subtitles.
   * <br/> - `'captions'`: The track contains closed captions, a translation of dialogue and sound effects.
   * <br/> - `'descriptions'`: The track contains descriptions, a textual description of the video.
   * <br/> - `'chapters'`: The track contains chapter titles.
   * <br/> - `'metadata'`: The track contains metadata. This track will not serve display purposes.
   */
  readonly kind: TextTrackKind;

  /**
   * The unlocalized label of the text track, as extracted from the manifest.
   *
   * @platform ios
   */
  readonly unlocalizedLabel?: string;

  /**
   * The label of the text track.
   */
  readonly label: string;

  /**
   * The language of the text track.
   */
  readonly language: string;

  /**
   * The identifier of the text track.
   *
   * @remarks
   * <br/> - This identifier can be used to distinguish between related tracks, e.g. tracks in the same list.
   */
  readonly id: string;

  /**
   * A unique identifier of the text track.
   *
   * @remarks
   * <br/> - This identifier is unique across tracks of a THEOplayer instance and can be used to distinguish between tracks.
   */
  readonly uid: number;

  /**
   * The mode of the text track, represented by a value from the following list:
   * <br/> - `'disabled'`: The track is disabled.
   * <br/> - `'showing'`: The track is showing.
   * <br/> - `'hidden'`: The track is enabled and loading cues, but not shown. (used for metadata tracks)
   */
  mode: TextTrackMode;

  /**
   * The content type of the text track.
   */
  readonly type: TextTrackType;

  /**
   * The list of cues of the track.
   *
   * @remarks
   * <br/> - If the {@link TextTrack.mode} is `'disabled'`, this property is `null`.
   */
  cues: TextTrackCue[] | null;

  /**
   * The source of the text track.
   */
  readonly src: string;

  /**
   * Indicates whether the track contains Forced Narrative cues.
   * This may only be true for subtitle tracks where
   * <br/> - For DASH: the corresponding AdaptationSet contains a child Role with its value attribute equal to `'forced_subtitle'`
   * <br/> - For HLS: the corresponding #EXT-X-MEDIA tag contains the attributes TYPE=SUBTITLES and FORCED=YES (not supported yet)
   */
  readonly forced: boolean;
}

/**
 * Retain renderable tracks.
 *
 * https://html.spec.whatwg.org/multipage/embedded-content.html#text-track-showing
 *
 * @category Media and Text Tracks
 * @internal
 */
export function filterRenderableTracks(textTracks: TextTrack[] | undefined): TextTrack[] | undefined {
  return textTracks && textTracks.filter((textTrack) => textTrack.kind === 'subtitles' || textTrack.kind === 'captions');
}

/**
 * Retain first thumbnail track encountered in the textTracks list.
 *
 * @category Media and Text Tracks
 * @internal
 */
export function filterThumbnailTracks(textTracks: TextTrack[] | undefined): TextTrack | undefined {
  return textTracks && textTracks.find(isThumbnailTrack);
}

/**
 * Query whether a track is a valid thumbnail track.
 *
 * @category Media and Text Tracks
 * @internal
 */
export function isThumbnailTrack(textTrack: TextTrack | undefined): boolean {
  return !!textTrack && (textTrack.kind === 'thumbnails' || (textTrack.kind === 'metadata' && textTrack.label === 'thumbnails'));
}
/**
 * Query whether a track is a given cue.
 *
 * @category Media and Text Tracks
 * @internal
 */
export function hasTextTrackCue(textTrack: TextTrack, cue: TextTrackCue): boolean {
  return !!(textTrack.cues && cue && textTrack.cues.find((c) => cue.uid === c.uid));
}

/**
 * Removes a cue from a text track.
 *
 * @category Media and Text Tracks
 * @internal
 */
export function removeTextTrackCue(textTrack?: TextTrack, cue?: TextTrackCue) {
  if (textTrack && textTrack.cues && cue && hasTextTrackCue(textTrack, cue)) {
    textTrack.cues = textTrack.cues.filter((c) => c.uid !== cue.uid);
  }
}

/**
 * Adds a cue to a text track.
 *
 * @category Media and Text Tracks
 * @internal
 */
export function addTextTrackCue(textTrack?: TextTrack, cue?: TextTrackCue) {
  if (textTrack && textTrack.cues && cue && !hasTextTrackCue(textTrack, cue)) {
    textTrack.cues.push(cue);
  }
}

/**
 * Returns a cue from a text track by uid.
 *
 * @category Media and Text Tracks
 * @internal
 */
export function findTextTrackByUid(textTracks: TextTrack[], uid: number): TextTrack | undefined {
  return textTracks.find((t) => t.uid === uid);
}
