import { Platform } from 'react-native';
import { THEOplayerNativeChromecast } from './THEOplayerNativeChromecast';
import { THEOplayerNativeAirplay } from './THEOplayerNativeAirplay';
import type { Airplay, CastAPI, Chromecast, THEOplayerView } from 'react-native-theoplayer';
import type { THEOplayer } from 'react-native-theoplayer';

export class THEOplayerNativeCastAdapter implements CastAPI {
  private readonly _chromecast: THEOplayerNativeChromecast;
  private readonly _airplay: THEOplayerNativeAirplay | undefined;

  constructor(private readonly _player: THEOplayer, private readonly _view: THEOplayerView) {
    this._chromecast = new THEOplayerNativeChromecast(this._player, this._view);
    if (Platform.OS !== 'android') {
      this._airplay = new THEOplayerNativeAirplay(this._player);
    }
  }

  get casting(): boolean {
    return this._chromecast.casting || this._airplay?.casting === true;
  }

  get chromecast(): Chromecast | undefined {
    return this._chromecast;
  }

  get airplay(): Airplay | undefined {
    return this._airplay;
  }

  unload_(): void {
    this._chromecast.unload_();
    this._airplay?.unload_();
  }
}
