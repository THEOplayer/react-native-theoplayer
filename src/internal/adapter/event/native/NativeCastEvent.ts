import type { CastState, ChromecastError } from 'react-native-theoplayer';
import type { CastEventType } from 'react-native-theoplayer';

export type NativeCastEvent = NativeChromecastChangeEvent | NativeAirplayStateChangeEvent | NativeChromecastErrorEvent;

export interface NativeChromecastChangeEvent {
  readonly type: CastEventType.CHROMECAST_STATE_CHANGE;

  readonly state: CastState;
}

export interface NativeAirplayStateChangeEvent {
  readonly type: CastEventType.AIRPLAY_STATE_CHANGE;

  readonly state: CastState;
}

export interface NativeChromecastErrorEvent {
  readonly type: CastEventType.CHROMECAST_ERROR;

  readonly error: ChromecastError;
}
