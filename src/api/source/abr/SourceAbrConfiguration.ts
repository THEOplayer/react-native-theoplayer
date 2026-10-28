/**
 * Describes the ABR configuration for a specific source.
 *
 * @category Source
 * @public
 */
export interface SourceAbrConfiguration {
  /**
   * A list of preferred audio codecs which will be used by the ABR algorithm for track selection, if the codec is supported.
   *
   * @platform web,android
   *
   * @remarks
   * <br/> - Codecs are specified by their RFC 6381 name, e.g. `"ec-3"` or `"mp4a.40.2"`.
   */
  preferredAudioCodecs?: string[];

  /**
   * A list of preferred video codecs which will be used by the ABR algorithm for track selection, if the codec is supported.
   *
   * @platform web,android
   *
   * @remarks
   * <br/> - Codecs are specified by their RFC 6381 name, e.g. `"hvc1"`, `"dvh1"` or `"avc1"`.
   */
  preferredVideoCodecs?: string[];
}
