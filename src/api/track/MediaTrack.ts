import type { Track } from './Track';
import type { Quality } from './Quality';

/**
 * Represents the category of a media track (audio or video).
 *
 * @category Media and Text Tracks
 * @public
 */
export type MediaTrackKind = 'main' | 'alternative';

/**
 * Represents a media track (audio or video) of a media resource.
 *
 * @category Media and Text Tracks
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
  readonly label: string;

  /**
   * The language of the media track.
   */
  readonly language: string;

  /**
   * The active quality of the media track, i.e. the quality that is currently being played.
   */
  readonly activeQuality: Quality | undefined;

  /**
   * The qualities of the media track.
   */
  readonly qualities: Quality[];

  /**
   * Marks the track to be the selected track for playout
   */
  readonly enabled: boolean;
}

/**
 * Find a media track by `uid` in a list of media tracks.
 *
 * @category Media and Text Tracks
 * @public
 */
export function findMediaTrackByUid(mediaTracks: MediaTrack[], uid: number | undefined): MediaTrack | undefined {
  return mediaTracks.find((track) => track.uid === uid);
}

/**
 * Find a quality by `uid` in a list of media tracks.
 *
 * @category Media and Text Tracks
 * @public
 */
export function findQualityByUid(mediaTrack: MediaTrack, uid: number | undefined): Quality | undefined {
  return mediaTrack.qualities.find((quality) => quality.uid === uid);
}

/**
 * Find a list of qualities by `uid` in a list of media tracks.
 *
 * @category Media and Text Tracks
 * @public
 */
export function findQualitiesByUid(mediaTrack: MediaTrack | undefined, uid: number | number[] | undefined): Quality[] | undefined {
  if (uid && mediaTrack) {
    if (Array.isArray(uid)) {
      return mediaTrack.qualities.filter((quality) => uid.includes(quality.uid));
    } else {
      const quality = findQualityByUid(mediaTrack, uid);
      return quality ? [quality] : undefined;
    }
  }
  return undefined;
}
