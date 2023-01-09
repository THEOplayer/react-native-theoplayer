import type { CastState, ChromecastError } from 'react-native-theoplayer';

export const CastEventNames = [
  /**
   * Dispatched when the ChromeCast state was changed.
   */
  'chromecaststatechange',

  /**
   * Dispatched when the Airplay state was changed.
   */
  'airplaystatechange',

  /**
   * Dispatched when an error occurred when using Chromecast.
   */
  'chromecasterror',
] as const;

export type CastEventType = typeof CastEventNames[number];

export interface CastEvent {
  /**
   * Type of ad event.
   */
  readonly type: CastEventType;
}

export interface ChromecastChangeEvent extends CastEvent {
  readonly type: 'chromecaststatechange';

  readonly state: CastState;
}

export interface AirplayStateChangeEvent extends CastEvent {
  readonly type: 'airplaystatechange';

  readonly state: CastState;
}

export interface ChromecastErrorEvent extends CastEvent {
  readonly type: 'chromecasterror';

  readonly error: ChromecastError;
}
