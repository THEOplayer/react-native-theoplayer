import { DefaultEventDispatcher } from '../event/DefaultEventDispatcher';
import type { PlayerEventMap } from 'react-native-theoplayer';
import type * as THEOplayerWeb from 'theoplayer';
import { PresentationMode } from 'src/api/presentation/PresentationMode';
import { DefaultPresentationModeChangeEvent } from '../event/PlayerEvents';
import { browserDetection } from '../../../web/platform/BrowserDetection';

export class WebPresentationModeManager extends DefaultEventDispatcher<PlayerEventMap> {
  private readonly _player: THEOplayerWeb.ChromelessPlayer;
  private _presentationMode: PresentationMode = PresentationMode.inline;
  private _element: HTMLVideoElement | undefined = undefined;

  constructor(player: THEOplayerWeb.ChromelessPlayer) {
    super();
    this._player = player;
  }

  get presentationMode(): PresentationMode {
    return this._presentationMode;
  }

  set presentationMode(presentationMode: PresentationMode) {
    if (presentationMode === this._presentationMode) {
      return;
    }

    this.prepareForPresentationModeChanges();

    // on iOS Safari requestFullscreen isn't supported (https://caniuse.com/?search=requestFullscreen), where we need to use webkit methods on the video element
    if (/*browserDetection.IS_IOS_ && */ browserDetection.IS_SAFARI_) {
      if (presentationMode === PresentationMode.fullscreen) {
        this._element?.webkitEnterFullscreen?.();
      } else if (presentationMode === PresentationMode.pip) {
        this._element?.webkitSetPresentationMode?.(PresentationMode.pip);
      } else {
        this._element?.webkitSetPresentationMode?.(PresentationMode.inline);
      }
    } else {
      // other web-platformsyarn
      
      if (presentationMode === PresentationMode.fullscreen) {
        const appElement = document.getElementById('app');
        void appElement?.requestFullscreen();
      } else if (presentationMode === PresentationMode.pip) {
        void this._element?.requestPictureInPicture?.();
      } else {
        if (this._presentationMode === PresentationMode.fullscreen) {
          void document.exitFullscreen();
        }
        if (this._presentationMode === PresentationMode.pip) {
          void document.exitPictureInPicture();
        }
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
    if (this._element != null) {
      this._element.onenterpictureinpicture = () => {
        this.updatePresentationMode();
      };
      this._element.onleavepictureinpicture = () => {
        this.updatePresentationMode();
      };
    }
    // listen for fullscreen updates on document
    document.onfullscreenchange = () => {
      this.updatePresentationMode();
    };
  }

  private updatePresentationMode() {
    // detect new presentation mode
    let newPresentationMode: PresentationMode = PresentationMode.inline;
    if (document.fullscreenElement !== null) {
      newPresentationMode = PresentationMode.fullscreen;
    } else if (document.pictureInPictureElement !== null) {
      newPresentationMode = PresentationMode.pip;
    }

    // when changed, notify by dispatching presentationModeChange event
    const previousPresentationMode = this._presentationMode;
    if (newPresentationMode !== previousPresentationMode) {
      this._presentationMode = newPresentationMode;
      this.dispatchEvent(new DefaultPresentationModeChangeEvent(this._presentationMode, previousPresentationMode)); // TODO: add context
    }
  }
}
