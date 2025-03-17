import { Ad } from 'react-native-theoplayer';

import { Interstitial } from './Interstitial';

/**
 *  The layout of the THEOad.
 */
export type TheoAdsLayout = 'single' | 'l-shape' | 'double';

/**
 * The THEOads interstitial that corresponds with ad playback.
 *
 * @category THEOads
 * @public
 */
export interface AdBreakInterstitial extends Interstitial {
  type: 'adbreak';

  /**
   * The layout which is used to play the ads of the interstitial.
   */
  layout: TheoAdsLayout;

  /**
   * The background when playing an ad.
   *
   * @remarks
   * - <br/> This is only available when playing in double or l-shape layout.
   */
  backdropUri: string | undefined;

  /**
   * The ads that are part of the interstitial.
   *
   * @remarks
   * - <br/> - Only available during ad playback.
   */
  ads: readonly Ad[];
}
