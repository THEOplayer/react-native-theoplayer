/**
 * Represents a track of a media resource.
 *
 * @remarks
 * <br/> - A specific track type (e.g. {@link TextTrack}) will always be used.
 *
 * @category Media and Text Tracks
 * @public
 */
export interface Track {
  /**
   * The kind of the track.
   *
   * @remarks
   * <br/> - The values for this property depend on the specific type of the track.
   */
  readonly kind: string;

  /**
   * The label of the track.
   */
  label: string;

  /**
   * The identifier of the track.
   *
   * @remarks
   * <br/> - This identifier can be used to distinguish between related tracks, e.g. tracks in the same list.
   *
   * @privateRemarks
   * <br/> - This identifier is a randomly generated string.
   */
  readonly id: string;

  /**
   * A unique identifier of the track.
   *
   * @remarks
   * <br/> - This identifier is unique across tracks of a THEOplayer instance and can be used to distinguish between tracks.
   * <br/> - This identifier is a randomly generated number.
   */
  readonly uid: number;

  /**
   * The language of the track.
   */
  readonly language: string;
}

/**
 * Checks whether a track list contains a given track.
 *
 * @category Media and Text Tracks
 * @internal
 */
export function hasTrack<TTrack extends Track>(trackList: TTrack[], track: TTrack): boolean {
  return !!(trackList && track && trackList.find((t) => t.uid === track.uid));
}

/**
 * Removes a track from a track list.
 *
 * @category Media and Text Tracks
 * @internal
 */
export function removeTrack<TTrack extends Track>(trackList: TTrack[], track: TTrack): TTrack[] {
  return trackList && track ? trackList.filter((t) => t.uid !== track.uid) : trackList;
}

/**
 * Adds a track to a track list.
 *
 * @category Media and Text Tracks
 * @internal
 */
export function addTrack<TTrack extends Track>(trackList: TTrack[], track: TTrack): TTrack[] {
  return trackList && track && !hasTrack(trackList, track) ? sortTracks([...trackList, track]) : trackList;
}

/**
 * Sort a track list based on the track's uids, which is how they are listed in the manifest.
 *
 * @category Media and Text Tracks
 * @internal
 */
export function sortTracks<TTrack extends Track>(trackList?: TTrack[]): TTrack[] {
  return trackList?.sort((t1: TTrack, t2: TTrack) => t1.uid - t2.uid) || [];
}
