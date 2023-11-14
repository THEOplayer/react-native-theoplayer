import type { TextTrackCue } from './TextTrackCue';

/**
 * Represents a cue of a HLS date range metadata text track.
 *
 * @public
 */
export interface DateRangeCue extends TextTrackCue {
  /**
   * The class of the date range cue.
   *
   * @remarks
   * <br/> - The class is a client-defined string specifying a set of attributes with associated value semantics.
   */
  class: string | undefined;

  /**
   * The playback position at which the date range cue becomes active, as a Date.
   */
  startDate: Date;

  /**
   * The playback position at which the date range cue becomes inactive, as a Date.
   */
  endDate: Date | undefined;

  /**
   * The duration of the date range cue, in milliseconds.
   */
  duration: number | undefined;

  /**
   * The planned duration of the date range cue, in milliseconds.
   *
   * @remarks
   * <br/> - This is used when the exact duration is not known yet.
   */
  plannedDuration: number | undefined;

  /**
   * Whether end-on-next is enabled for the date range cue.
   *
   * @remarks
   * <br/> - End-on-next results in the {@link DateRangeCue.endDate} of the date range cue becoming equal to the {@link DateRangeCue.startDate} of the next date range cue with the same {@link DateRangeCue."class"}, once it is known.
   */
  endOnNext: boolean;

  /**
   * The SCTE 'cmd' splice_info_section of the date range cue.
   */
  scte35Cmd: ArrayBuffer | undefined;

  /**
   * The SCTE 'out' splice_info_section of the date range cue.
   */
  scte35Out: ArrayBuffer | undefined;

  /**
   * The SCTE 'in' splice_info_section of the date range cue.
   */
  scte35In: ArrayBuffer | undefined;

  /**
   * Custom attributes extracted from the cue source.
   */
  customAttributes: Record<string, string | number | ArrayBuffer>;
}
