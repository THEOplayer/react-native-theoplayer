import type { Ad, AdBreak } from 'react-native-theoplayer';

export interface AdEvent {
  /**
   * Type of ad event.
   */
  type: AdEventType;

  /**
   * The ad or adbreak for which the event was dispatched.
   */
  ad: Ad | AdBreak;
}

export const AdEventNames = [
  /**
   * Dispatched when an ad break is added.
   */
  'addadbreak',

  /**
   * Dispatched when an ad break is removed.
   */
  'removeadbreak',

  /**
   * Dispatched when an ad is loaded.
   */
  'adloaded',

  /**
   * Dispatched when an ad break begins.
   */
  'adbreakbegin',

  /**
   * Dispatched when an ad break ends.
   */
  'adbreakend',

  /**
   * Dispatched when an ad break changes.
   */
  'adbreakchange',

  /**
   * Dispatched when an ad break is updated.
   */
  'updateadbreak',

  /**
   * Dispatched when an ad is added.
   */
  'addad',

  /**
   * Dispatched when an ad begins.
   */
  'adbegin',

  /**
   * Dispatched when an ad ends.
   */
  'adend',

  /**
   * Dispatched when an ad is updated.
   */
  'updatead',

  /**
   * Dispatched when an ad is loaded.
   */
  'adloaded',

  /**
   * Dispatched when an ad reaches the first quartile.
   */
  'adfirstquartile',

  /**
   * Dispatched when an ad reaches the mid point.
   */
  'admidpoint',

  /**
   * Dispatched when an ad reaches the third quartile.
   */
  'adthirdquartile',

  /**
   * Dispatched when an ad is skipped.
   */
  'adskip',

  /**
   * Dispatched when an ad counts as an impression.
   */
  'adimpression',

  /**
   * Dispatched when an ad error occurs.
   */
  'aderror',

  /**
   * Dispatched when an ads list is loaded.
   */
  'admetadata',

  /**
   * Dispatched when the ad has stalled playback to buffer.
   */
  'adbuffering'
] as const;

export type AdEventType = typeof AdEventNames[number];
