import type { TimeRange, TextTrack } from 'react-native-theoplayer';
import type { StyleProp, ViewStyle } from 'react-native';
import type { SeekBarPosition } from './SeekBarPosition';

// default value when skipping forward
export const SKIP_FORWARD_MSEC_DEFAULT = 10000;

// default value when skipping backwards
export const SKIP_BACKWARD_MSEC_DEFAULT = 10000;

// wait for scrubbing to settle down before doing an actual seek
export const SEEK_TIMER_DELAY_MSEC = 1000;

// wait for a number of time updates after seeking to avoid progress jumps.
export const TIMEUPDATES_AFTER_SEEKING = 3;

export interface SeekBarProps {
  /**
   * Invoked on TV platforms when the user presses the progress dot.
   */
  onDotPress?: () => void;

  /**
   * Invoked after the scrubber settles.
   */
  onSeek?: (time: number) => void;

  /**
   * Invoked when the user starts scrubbing.
   */
  onStartScrubbing?: () => void;

  /**
   * Invoked on each scrubber time change.
   */
  onScrubbingPositionChanged?: (time: number, prevTime: number) => void;

  /**
   * Invoked when the user stops scrubbing.
   */
  onStopScrubbing?: () => void;

  /**
   * Used to set the current media's seekable range.
   */
  seekable: TimeRange[];

  /**
   * The current media's duration.
   */
  duration: number;

  /**
   * Used to set the player's currentTime.
   */
  currentTime: number;

  /**
   * Optional thumbnail track.
   */
  thumbnailTrack?: TextTrack | undefined;

  /**
   * Thumbnail view mode.
   */
  thumbnailMode?: 'single' | 'carousel';

  /**
   * Used to set the amount of time the seek bar will skip forward, in milliseconds.
   * By default equals to SKIP_FORWARD_MSEC_DEFAULT.
   */
  skipForwardMsec?: number;

  /**
   * Used to set the amount of time the seek bar will skip backward, in milliseconds.
   * By default equals to SKIP_BACKWARD_MSEC_DEFAULT.
   */
  skipBackwardMsec?: number;

  /**
   * Optionally render a custom component on top of the seekbar.
   */
  renderTopComponent?: (seekbarPos: SeekBarPosition) => JSX.Element | undefined;

  /**
   * Optionally render a custom component below the seekbar.
   */
  renderBottomComponent?: (seekbarPos: SeekBarPosition) => JSX.Element | undefined;

  /**
   * Optional style applied to the SeekBar.
   */
  style?: StyleProp<ViewStyle>;

  /**
   * Optional style applied to the progressDot.
   */
  progressDotStyle?: StyleProp<ViewStyle>;
}
