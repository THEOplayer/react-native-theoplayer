import { THEOplayer, MediaControlAction, MediaControlAPI, MediaControlHandler } from 'react-native-theoplayer';
import { NativeEventEmitter, NativeModules } from 'react-native';

const NativeMediaControlModule = NativeModules.THEORCTMediaControlModule;

export class MediaControlNativeAdapter implements MediaControlAPI {
  private mediaControlEmitter = new NativeEventEmitter(NativeMediaControlModule);
  private handlers: Map<MediaControlAction, MediaControlHandler> = new Map();

  constructor(private readonly _player: THEOplayer) {
    this.mediaControlEmitter.addListener('MediaControlEvent', (event) => {
      const { tag, action } = event;
      if (tag === this._player.nativeHandle) {
        this.handlers.get(action)?.(this._player);
      }
    });
  }

  setHandler(action: MediaControlAction, handler: MediaControlHandler): void {
    this.handlers.set(action, handler);
    NativeMediaControlModule.setHandler(this._player.nativeHandle || -1, action);
  }
}
