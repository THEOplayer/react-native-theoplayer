import type { TextTrack } from 'react-native-theoplayer';
import type { StyleProp, ViewStyle } from 'react-native';

export interface ThumbnailViewProps {
  /**
   * Thumbnail track. A valid thumbnail track should have properties:
   * <br/> - `'kind'` equals `'metadata'`.
   * <br/> - `'label'` equals `'thumbnails'`.
   */
  thumbnailTrack: TextTrack;

  /**
   * Used to set whether thumbnails are currently visible.
   */
  visible?: boolean;

  /**
   * Current time.
   */
  time: number;

  /**
   * Stream duration
   */
  duration: number;

  /**
   * Whether to show a time label.
   */
  showTimeLabel: boolean;

  /**
   * Used to set the width of the rendered thumbnail. The height will be calculated according to the image's aspect ratio.
   */
  size: number;

  /**
   * Optional horizontal offset for the thumbnail image.
   */
  offset?: number;

  /**
   * The number of extra thumbnails to show to the left/right of the current thumbnail, in carousel mode.
   */
  carouselCount?: number;

  /**
   * Apply optional scaling to the carousel thumbnail, given the thumbnail index.
   *
   * @remarks
   * <br/> - Example indices for a carousel with carouselCount = 2: [-2, -1, 0, 1, 2]
   */
  carouselThumbnailScale?: (index: number) => number;

  /**
   * Optional style applied to the thumbnail(s) container.
   */
  containerStyle?: StyleProp<ViewStyle>;

  /**
   * Optional style applied to the thumbnail at current time.
   */
  thumbnailStyleCurrent?: StyleProp<ViewStyle>;

  /**
   * Optional style applied to other thumbnails in the carousel.
   */
  thumbnailStyleCarousel?: StyleProp<ViewStyle>;

  /**
   * Optional style applied to the time label.
   */
  timeLabelStyle?: StyleProp<ViewStyle>;
}
