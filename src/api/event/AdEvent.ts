import type { Ad, AdBreak, PlayerEventType } from 'react-native-theoplayer';
import type { Event } from './Event';

export interface AdEvent extends Event<PlayerEventType.AD_EVENT> {
  /**
   * Type of ad event.
   */
  subType: AdEventType;

  /**
   * The ad or adbreak for which the event was dispatched.
   */
  ad: Ad | AdBreak;
}

export enum AdEventType {
  /**
   * Dispatched when an ad break is added.
   */
  ADD_AD_BREAK = 'addadbreak',

  /**
   * Dispatched when an ad break is removed.
   */
  REMOVE_AD_BREAK = 'removeadbreak',

  /**
   * Dispatched when an ad is loaded.
   */
  AD_LOADED = 'adloaded',

  /**
   * Dispatched when an ad break begins.
   */
  AD_BREAK_BEGIN = 'adbreakbegin',

  /**
   * Dispatched when an ad break ends.
   */
  AD_BREAK_END = 'adbreakend',

  /**
   * Dispatched when an ad break changes.
   */
  AD_BREAK_CHANGE = 'adbreakchange',

  /**
   * Dispatched when an ad break is updated.
   */
  UPDATE_AD_BREAK = 'updateadbreak',

  /**
   * Dispatched when an ad is added.
   */
  ADD_AD = 'addad',

  /**
   * Dispatched when an ad begins.
   */
  AD_BEGIN = 'adbegin',

  /**
   * Dispatched when an ad ends.
   */
  AD_END = 'adend',

  /**
   * Dispatched when an ad is updated.
   */
  UPDATE_AD = 'updatead',

  /**
   * Dispatched when an ad reaches the first quartile.
   */
  AD_FIRST_QUARTILE = 'adfirstquartile',

  /**
   * Dispatched when an ad reaches the mid point.
   */
  AD_MIDPOINT = 'admidpoint',

  /**
   * Dispatched when an ad reaches the third quartile.
   */
  AD_THIRD_QUARTILE = 'adthirdquartile',

  /**
   * Dispatched when an ad is skipped.
   */
  AD_SKIP = 'adskip',

  /**
   * Dispatched when an ad counts as an impression.
   */
  AD_IMPRESSION = 'adimpression',

  /**
   * Dispatched when an ad error occurs.
   */
  AD_ERROR = 'aderror',

  /**
   * Dispatched when an ads list is loaded.
   */
  AD_METADATA = 'admetadata',

  /**
   * Dispatched when the ad has stalled playback to buffer.
   */
  AD_BUFFERING = 'adbuffering',

  /**
   * Dispatched when an ad is clicked.
   *
   * @remarks
   * <br/> - Available only on iOS and Android.
   */
  AD_CLICKED = 'adclicked',

  /**
   * Dispatched when a non-clickthrough portion of an ad is tapped.
   *
   * @remarks
   * <br/> - Available only on iOS and Android.
   */
  AD_TAPPED = 'adtapped',

  /**
   * Dispatched when the user has tapped an ad icon, for example the 'Why this ad' (WTA) icon.
   *
   * - On iOS and Android mobile apps, the SDK will navigate to the landing page.
   * - On tvOS and Android TV, the SDK will present a modal dialog containing the VAST icon fallback image.
   *
   * @remarks
   * <br/> - Available only on Android.
   *
   * @see <a href="https://developers.google.com/interactive-media-ads/docs/sdks/android/client-side/api/reference/com/google/ads/interactivemedia/v3/api/AdEvent.AdEventType#public-static-final-adevent.adeventtype-icon_tapped">Android IMA reference</a>
   */
  AD_ICON_TAPPED = 'adicontapped',

  /**
   * Dispatched when the user has closed the icon fallback image dialog.
   *
   * @remarks
   * <br/> - Available only on Android.
   *
   * @see <a href="https://developers.google.com/interactive-media-ads/docs/sdks/android/client-side/api/reference/com/google/ads/interactivemedia/v3/api/AdEvent.AdEventType#public-static-final-adevent.adeventtype-icon_fallback_image_closed">Android IMA reference</a>
   */
  AD_ICON_FALLBACK_IMAGE_CLOSED = 'adiconfallbackimageclosed'
}
