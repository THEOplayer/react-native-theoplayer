import { Interstitial } from './Interstitial';

/**
 * The THEOads interstitial that corresponds with overlay playback.
 *
 * @category Ads
 * @category THEOads
 * @public
 */
export interface OverlayInterstitial extends Interstitial {
  type: 'overlay';

  /**
   * The url of the image of the overlay.
   */
  imageUrl: string | undefined;

  /**
   * The clickThrough url of the overlay.
   */
  clickThrough: string | undefined;

  /**
   * The position of the overlay.
   */
  position: OverlayPosition;

  /**
   * The size of the overlay.
   */
  size: OverlaySize;
}

/**
 * The position information of the overlay.
 *
 * @category Ads
 * @category THEOads
 * @public
 */
export interface OverlayPosition {
  left?: number;
  right?: number;
  top?: number;
  bottom?: number;
}

/**
 * The size information of the overlay.
 *
 * @category Ads
 * @category THEOads
 * @public
 */
export interface OverlaySize {
  width?: number;
  height?: number;
}
