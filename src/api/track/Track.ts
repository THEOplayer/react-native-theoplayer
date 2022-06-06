/**
 * Represents a track of a media resource.
 *
 * @remarks
 * <br/> - A specific track type (e.g. {@link TextTrack}) will always be used.
 *
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
