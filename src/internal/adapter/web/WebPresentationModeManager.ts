import type { PlayerEventMap } from 'react-native-theoplayer';
import { PresentationMode } from 'react-native-theoplayer';
import type { ChromelessPlayer } from 'theoplayer';
import { DefaultPresentationModeChangeEvent } from '../event/PlayerEvents';
import type { DefaultEventDispatcher } from '../event/DefaultEventDispatcher';
import { fullscreenAPI } from './FullscreenAPI';
import { noOp } from '../../utils/CommonUtils';

export class WebPresentationModeManager {
  private readonly _player: ChromelessPlayer;
  private _presentationMode: PresentationMode = PresentationMode.inline;
  private _element: HTMLVideoElement | undefined = undefined;
  private _eventForwarder: DefaultEventDispatcher<PlayerEventMap>;

  constructor(player: ChromelessPlayer, eventForwarder: DefaultEventDispatcher<PlayerEventMap>) {
    this._player = player;
    this._eventForwarder = eventForwarder;
  }

  get presentationMode(): PresentationMode {
    return this._presentationMode;
  }

  set presentationMode(presentationMode: PresentationMode) {
    if (presentationMode === this._presentationMode) {
      return;
    }

    this.prepareForPresentationModeChanges();

    if (fullscreenAPI !== undefined) {
      // All other browsers
      if (presentationMode === PresentationMode.fullscreen) {
        const appElement = document.getElementById('app') ?? document.getElementById('root');
        if (appElement !== null) {
          const promise = appElement[fullscreenAPI.requestFullscreen_]();
          if (promise && promise.then) {
            promise.then(noOp, noOp);
          }
        }
      } else if (presentationMode === PresentationMode.pip) {
        void this._element?.requestPictureInPicture?.();
      } else {
        if (this._presentationMode === PresentationMode.fullscreen) {
          const promise = document[fullscreenAPI.exitFullscreen_]();
          if (promise && promise.then) {
            promise.then(noOp, noOp);
          }
        }
        if (this._presentationMode === PresentationMode.pip) {
          void document.exitPictureInPicture();
        }
      }
    } else {
      // iOS Safari doesn't properly support fullscreen, use native fullscreen instead
      if (presentationMode === PresentationMode.fullscreen) {
        this._element?.webkitEnterFullscreen?.();
      } else if (presentationMode === PresentationMode.pip) {
        this._element?.webkitSetPresentationMode?.(PresentationMode.pip);
      } else {
        this._element?.webkitSetPresentationMode?.(PresentationMode.inline);
      }
    }
  }

  private prepareForPresentationModeChanges() {
    const elements = this._player.element.children;
    for (const element of Array.from(elements)) {
      if (element.tagName === 'VIDEO' && element.attributes.getNamedItem('src') !== null) {
        this._element = element as HTMLVideoElement;
      }
    }
    // listen for pip updates on element
    if (this._element !== undefined) {
      this._element.onenterpictureinpicture = () => {
        this.updatePresentationMode();
      };
      this._element.onleavepictureinpicture = () => {
        this.updatePresentationMode();
      };
    }
    // listen for fullscreen updates on document
    if (fullscreenAPI !== undefined) {
      document.addEventListener(fullscreenAPI.fullscreenchange_, this.updatePresentationMode);
      document.addEventListener(fullscreenAPI.fullscreenerror_, this.updatePresentationMode);
    }
  }

  private updatePresentationMode = () => {
    // detect new presentation mode
    let newPresentationMode: PresentationMode = PresentationMode.inline;
    if (fullscreenAPI !== undefined && document[fullscreenAPI.fullscreenElement_] !== null) {
      newPresentationMode = PresentationMode.fullscreen;
    } else if (document.pictureInPictureElement !== null) {
      newPresentationMode = PresentationMode.pip;
    }

    // when changed, notify by dispatching presentationModeChange event
    const previousPresentationMode = this._presentationMode;
    if (newPresentationMode !== previousPresentationMode) {
      this._presentationMode = newPresentationMode;
      this._eventForwarder.dispatchEvent(new DefaultPresentationModeChangeEvent(this._presentationMode, previousPresentationMode));
    }
  };
}
