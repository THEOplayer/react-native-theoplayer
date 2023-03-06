import { DefaultEventDispatcher } from '../event/DefaultEventDispatcher';
import type { PlayerEventMap } from 'react-native-theoplayer';
import type * as THEOplayerWeb from 'theoplayer';
import type { PresentationMode } from 'src/api/presentation/PresentationMode';
import { DefaultPresentationModeChangeEvent } from '../event/PlayerEvents';
import { browserDetection } from '../../../web/platform/BrowserDetection';

export class WebPresentationModeManager extends DefaultEventDispatcher<PlayerEventMap> {
  private readonly _player: THEOplayerWeb.ChromelessPlayer;
  private _presentationMode: PresentationMode = 'inline';
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
    if (/*browserDetection.IS_IOS_ && */browserDetection.IS_SAFARI_) {
      if (presentationMode === 'fullscreen') {
        this._element?.webkitEnterFullscreen?.();
      } else if (presentationMode === 'picture-in-picture') {
        this._element?.webkitSetPresentationMode?.('picture-in-picture');
      } else {
        this._element?.webkitSetPresentationMode?.('inline');
      }
    } else {
      // other web-platforms
      if (presentationMode === 'fullscreen') {
        const appElement = document.getElementById('app');
        void appElement?.requestFullscreen();
      } else if (presentationMode === 'picture-in-picture') {
        void this._element?.requestPictureInPicture?.();
      } else {
        if (this._presentationMode === 'fullscreen') {
          void document.exitFullscreen();
        }
        if (this._presentationMode === 'picture-in-picture') {
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
    let newPresentationMode: PresentationMode = 'inline';
    if (document.fullscreenElement !== null) {
      newPresentationMode = 'fullscreen';
    } else if (document.pictureInPictureElement !== null) {
      newPresentationMode = 'picture-in-picture';
    }

    // when changed, notify by dispatching presentationModeChange event
    let previousPresentationMode = this._presentationMode
    if (newPresentationMode !== previousPresentationMode) {
      this._presentationMode = newPresentationMode;
      this.dispatchEvent(new DefaultPresentationModeChangeEvent(this._presentationMode, previousPresentationMode)); // TODO: add context
    }
  }
}
