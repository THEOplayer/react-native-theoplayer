import type { Airplay, CastState } from 'react-native-theoplayer';
import { CastEvent, CastEventType, PlayerEventType, THEOplayer } from 'react-native-theoplayer';
import { NativeModules } from 'react-native';

export class THEOplayerNativeAirplay implements Airplay {
  private readonly _player: THEOplayer;

  private _casting = false;
  private _state: CastState = 'available';

  public constructor(player: THEOplayer) {
    this._player = player;
    this._player.addEventListener(PlayerEventType.CAST_EVENT, this._onCastStateChange);
    void this.init_();
  }

  async init_(): Promise<void> {
    this._casting = await NativeModules.CastModule.airplayCasting(this._player.nativeHandle);
    this._state = await NativeModules.CastModule.airplayState(this._player.nativeHandle);
  }

  private readonly _onCastStateChange = (event: CastEvent) => {
    if (event.subType === CastEventType.AIRPLAY_STATE_CHANGE) {
      this._state = event.state;
      this._casting = event.state === 'connected';
    }
  };

  get casting(): boolean {
    return this._casting;
  }

  get state(): CastState {
    return this._state;
  }

  start(): void {
    NativeModules.CastModule.airplayStart(this._player.nativeHandle);
  }

  stop(): void {
    NativeModules.CastModule.airplayStop(this._player.nativeHandle);
  }

  unload_(): void {
    this._player.removeEventListener(PlayerEventType.CAST_EVENT, this._onCastStateChange);
  }
}
