import type { CastState, ChromecastError, PlayerEventType } from 'react-native-theoplayer';
import type { Event } from './Event';

/**
 * The event types dispatched by the {@link CastAPI | Cast API}.
 *
 * @category Events
 * @category Casting
 * @public
 */
export enum CastEventType {
  /**
   * Dispatched when the ChromeCast state was changed.
   */
  CHROMECAST_STATE_CHANGE = 'chromecaststatechange',

  /**
   * Dispatched when the Airplay state was changed.
   */
  AIRPLAY_STATE_CHANGE = 'airplaystatechange',

  /**
   * Dispatched when an error occurred when using Chromecast.
   */
  CHROMECAST_ERROR = 'chromecasterror',
}

/**
 * The event dispatched by the {@link CastAPI | Cast API}.
 *
 * @category Events
 * @category Casting
 * @public
 */
export type CastEvent = ChromecastChangeEvent | AirplayStateChangeEvent | ChromecastErrorEvent;

/**
 * Dispatched when the chromecast state changes.
 *
 * @category Events
 * @category Casting
 * @public
 */
export interface ChromecastChangeEvent extends Event<PlayerEventType.CAST_EVENT> {
  readonly subType: CastEventType.CHROMECAST_STATE_CHANGE;

  readonly state: CastState;
}

/**
 * Dispatched when the airplay state changes.
 *
 * @category Events
 * @category Casting
 * @public
 */
export interface AirplayStateChangeEvent extends Event<PlayerEventType.CAST_EVENT> {
  readonly subType: CastEventType.AIRPLAY_STATE_CHANGE;

  readonly state: CastState;
}

/**
 * Dispatched when a chromecast error occurs.
 *
 * @category Events
 * @category Casting
 * @public
 */
export interface ChromecastErrorEvent extends Event<PlayerEventType.CAST_EVENT> {
  readonly subType: CastEventType.CHROMECAST_ERROR;

  readonly error: ChromecastError;
}
