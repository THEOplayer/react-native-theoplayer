import type { CastEvent, Chromecast, THEOplayerView } from 'react-native-theoplayer';
import { CastEventType, CastState, PlayerEventType, THEOplayer } from 'react-native-theoplayer';
import { NativeModules } from 'react-native';

const NativeCastModule = NativeModules.THEORCTCastModule;

export class THEOplayerNativeChromecast implements Chromecast {
  private readonly _player: THEOplayer;
  private readonly _view: THEOplayerView;

  private _casting = false;
  private _state: CastState = CastState.available;

  public constructor(player: THEOplayer, view: THEOplayerView) {
    this._player = player;
    this._view = view;
    this._player.addEventListener(PlayerEventType.CAST_EVENT, this._onCastStateChange);
  }

  async init_(): Promise<void> {
    this._casting = await NativeCastModule.chromecastCasting(this._view.nativeHandle);
    this._state = await NativeCastModule.chromecastState(this._view.nativeHandle);
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
    NativeCastModule.chromecastStart(this._view.nativeHandle);
  }

  stop(): void {
    NativeCastModule.chromecastStop(this._view.nativeHandle);
  }

  join(): void {
    NativeCastModule.chromecastJoin(this._view.nativeHandle);
  }

  leave(): void {
    NativeCastModule.chromecastLeave(this._view.nativeHandle);
  }

  unload_(): void {
    this._player.removeEventListener(PlayerEventType.CAST_EVENT, this._onCastStateChange);
  }
}
