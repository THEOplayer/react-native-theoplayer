/**
 * Represents a cue of a text track.
 *
 * @public
 */
export interface TextTrackCue {
  /**
   * The identifier of the cue.
   */
  id: string;

  /**
   * A unique identifier of the text track cue.
   *
   * @remarks
   * <br/> - This identifier is unique across text track cues of a THEOplayer instance and can be used to distinguish between cues.
   * <br/> - This identifier is a randomly generated number.
   */
  readonly uid: number;

  /**
   * The playback position at which the cue becomes active, in milliseconds.
   */
  startTime: number;

  /**
   * The playback position at which the cue becomes inactive, in milliseconds.
   */
  endTime: number;

  /**
   * The content of the cue.
   *
   * @remarks
   * The content differs depending on the {@link TextTrackCue.track}'s {@link TextTrack."type" | type }:
   * <br/> - `'emsg'`: Content is a Uint8Array representing the binary message data from the `emsg` box.
   * <br/> - `'eventstream'`: Content is the value of the `messageData` attribute which was specified in the manifest.
   * <br/> - `'ttml'`: Content is an intermediate TTML document’s body element. This is a view of a TTML document where all nodes in the document are active during the cue’s startTime and endTime. As a result, all begin, dur and end properties have been removed. TTML Styles, Regions and Metadata are stored in cue.styles, cue.regions, cue.metadata respectively. Combining those properties with the given content should suffice to render a TTML cue.
   * <br/> - `'webvtt'`: Content is the cue text in raw unparsed form.
   */
  content: any;
}
