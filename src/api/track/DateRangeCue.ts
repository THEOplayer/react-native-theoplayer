import type { TextTrackCue } from './TextTrackCue';

/**
 * Represents a cue of a text track derived from a daterange tag
 *
 * @public
 */
export interface DateRangeCue extends TextTrackCue {

  /**
   * Custom attributes extracted from the cue source.
   */

  customAttributes: Record<string, string | number | ArrayBuffer>;
}
