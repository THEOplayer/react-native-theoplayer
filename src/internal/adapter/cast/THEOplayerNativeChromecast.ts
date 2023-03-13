import type { CastEvent, CastState, Chromecast, THEOplayerView } from 'react-native-theoplayer';
import { CastEventType, PlayerEventType, THEOplayer } from 'react-native-theoplayer';
import { NativeModules } from 'react-native';

export class THEOplayerNativeChromecast implements Chromecast {
  private readonly _player: THEOplayer;
  private readonly _view: THEOplayerView;

  private _casting = false;
  private _state: CastState = 'available';

  public constructor(player: THEOplayer, view: THEOplayerView) {
    this._player = player;
    this._view = view;
    this._player.addEventListener(PlayerEventType.CAST_EVENT, this._onCastStateChange);
    void this.init_();
  }

  async init_(): Promise<void> {
    this._casting = await NativeModules.CastModule.chromecastCasting(this._view.nativeHandle);
    this._state = await NativeModules.CastModule.chromecastState(this._view.nativeHandle);
  }

  private readonly _onCastStateChange = (event: CastEvent) => {
    if (event.subType === CastEventType.CHROMECAST_STATE_CHANGE) {
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
    NativeModules.CastModule.chromecastStart(this._view.nativeHandle);
  }

  stop(): void {
    NativeModules.CastModule.chromecastStop(this._view.nativeHandle);
  }

  join(): void {
    NativeModules.CastModule.chromecastJoin(this._view.nativeHandle);
  }

  leave(): void {
    NativeModules.CastModule.chromecastLeave(this._view.nativeHandle);
  }

  unload_(): void {
    this._player.removeEventListener(PlayerEventType.CAST_EVENT, this._onCastStateChange);
  }
}
