import type { Track } from './Track';
import type { Quality } from './Quality';

export type MediaTrackKind = 'main' | 'alternative';

/**
 * Represents a media track (audio or video) of a media resource.
 *
 * @public
 */
export interface MediaTrack extends Track {
  /**
   * The identifier of the media track.
   *
   * @remarks
   * <br/> - This identifier can be used to distinguish between related tracks, e.g. tracks in the same list.
   */
  // Note: This identifier is a randomly generated string.
  readonly id: string;

  /**
   * A unique identifier of the media track.
   *
   * @remarks
   * <br/> - This identifier is unique across tracks of a THEOplayer instance and can be used to distinguish between tracks.
   * <br/> - This identifier is a randomly generated number.
   */
  readonly uid: number;

  /**
   * The kind of the media track, represented by a value from the following list:
   * <br/> - `'main'`: The track is the default track for playback
   * <br/> - `'alternative'`: The track is not the default track for playback
   */
  readonly kind: MediaTrackKind;

  /**
   * The label of the media track.
   */
  label: string;

  /**
   * The language of the media track.
   */
  readonly language: string;

  /**
   * The uid of the active quality of the media track, i.e. the quality that is currently being played.
   */
  readonly activeQuality: number | undefined;

  /**
   * The qualities of the media track.
   */
  readonly qualities: Quality[];

  /**
   * One or more desired uids of qualities of the media track.
   *
   * @remarks
   * <br/> - If desired qualities are present, the Adaptive Bitrate mechanism of the player will limit itself to these qualities.
   * <br/> - If one desired quality is present, the Adaptive Bitrate mechanism of the player will be disabled and the desired quality will be played back.
   */
  targetQuality: number | number[] | undefined;
}
