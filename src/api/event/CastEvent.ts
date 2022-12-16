import type { CastState, ChromecastError, PlayerEventType } from 'react-native-theoplayer';
import type { Event } from './Event';

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

export type CastEvent = ChromecastChangeEvent | AirplayStateChangeEvent | ChromecastErrorEvent;

export interface ChromecastChangeEvent extends Event<PlayerEventType.CAST_EVENT> {
  readonly subType: CastEventType.CHROMECAST_STATE_CHANGE;

  readonly state: CastState;
}

export interface AirplayStateChangeEvent extends Event<PlayerEventType.CAST_EVENT> {
  readonly subType: CastEventType.AIRPLAY_STATE_CHANGE;

  readonly state: CastState;
}

export interface ChromecastErrorEvent extends Event<PlayerEventType.CAST_EVENT> {
  readonly subType: CastEventType.CHROMECAST_ERROR;

  readonly error: ChromecastError;
}
