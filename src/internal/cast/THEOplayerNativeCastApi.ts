import { NativeModules, Platform } from 'react-native';
import { THEOplayerNativeChromecast } from './THEOplayerNativeChromecast';
import { THEOplayerNativeAirplay } from './THEOplayerNativeAirplay';
import type { Airplay, CastAPI, Chromecast, THEOplayerView } from '@wouterds/react-native-theoplayer';

export class THEOplayerNativeCastAPI implements CastAPI {
  private readonly _chromecast: Chromecast;
  private readonly _airplay: Airplay | undefined;

  constructor(private readonly _player: THEOplayerView) {
    this._chromecast = new THEOplayerNativeChromecast(this._player);
    if (Platform.OS !== 'android') {
      this._airplay = new THEOplayerNativeAirplay(this._player);
    }
  }

  casting(): Promise<boolean> {
    return NativeModules.CastModule.casting(this._player.nativeHandle);
  }

  get chromecast(): Chromecast | undefined {
    return this._chromecast;
  }

  get airplay(): Airplay | undefined {
    return this._airplay;
  }
}
