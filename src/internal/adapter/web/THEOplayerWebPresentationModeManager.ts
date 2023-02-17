import { DefaultEventDispatcher } from '../event/DefaultEventDispatcher';
import type { PlayerEventMap } from 'react-native-theoplayer';
import type * as THEOplayerWeb from 'theoplayer';
import type { PresentationMode } from 'src/api/presentation/PresentationMode';
import { DefaultPresentationModeChangeEvent } from '../event/PlayerEvents';

export class THEOplayerWebPresentationModeManager extends DefaultEventDispatcher<PlayerEventMap> {
  private readonly _player: THEOplayerWeb.ChromelessPlayer;
  private _presentationMode: PresentationMode = 'inline';

  constructor(player: THEOplayerWeb.ChromelessPlayer) {
    super();
    this._player = player;
  }

  get presentationMode(): PresentationMode {
    return this._presentationMode;
  }

  set presentationMode(presentationMode: PresentationMode) {
    const oldPresentationMode = this._presentationMode;
    this._presentationMode = presentationMode;
    if (presentationMode == oldPresentationMode) {
      return;
    }
    const element = this.presentationModeVideoElement();
    
    // requestFullscreen isn't supported on for example iOS Safari: https://caniuse.com/?search=requestFullscreen
    // There, we use webkitEnterFullscreen which needs to be called on the video element
    if (element?.webkitSupportsPresentationMode && typeof element?.webkitSetPresentationMode === "function") {
      if (presentationMode == 'fullscreen') {
        element?.webkitEnterFullscreen?.();
        this.dispatchEvent(new DefaultPresentationModeChangeEvent('fullscreen'));
      } else if (presentationMode == 'picture-in-picture') {
        element?.webkitSetPresentationMode?.('picture-in-picture');
        this.dispatchEvent(new DefaultPresentationModeChangeEvent('picture-in-picture'));
      } else {
        element?.webkitSetPresentationMode?.('inline');
        this.dispatchEvent(new DefaultPresentationModeChangeEvent('inline'));
      } 
      return
    }

    // Other web-platforms:
    if (presentationMode == 'fullscreen') {
      const appContainer = document.getElementById('app');
      appContainer?.requestFullscreen().then();
      this.dispatchEvent(new DefaultPresentationModeChangeEvent('fullscreen'));
    } else if (presentationMode == 'picture-in-picture') {
      element?.requestPictureInPicture?.();
      this.dispatchEvent(new DefaultPresentationModeChangeEvent('picture-in-picture'));
    } else {
      if (oldPresentationMode == 'fullscreen') {
        document.exitFullscreen().then();
      }
      if (oldPresentationMode == 'picture-in-picture') {
        document.exitPictureInPicture().then();
      }
      this.dispatchEvent(new DefaultPresentationModeChangeEvent('inline'));
    }
  }

  private presentationModeVideoElement(): HTMLVideoElement | undefined {
    const elements = this._player.element.children;
    for (const element of Array.from(elements)) {
      if (element.tagName === 'VIDEO' && element.attributes.getNamedItem('src') !== null) {
        return (element as HTMLVideoElement)
      }
    }
    return undefined
  }

}
