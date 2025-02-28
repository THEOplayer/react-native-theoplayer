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
  private _eventForwarder: DefaultEventDispatcher<PlayerEventMap>;

  constructor(player: ChromelessPlayer, eventForwarder: DefaultEventDispatcher<PlayerEventMap>) {
    this._player = player;
    this._eventForwarder = eventForwarder;
    this._player.presentation.addEventListener('presentationmodechange', this.updatePresentationMode);
    this.maybePrepareForPresentationModeChanges();
  }

  get presentationMode(): PresentationMode {
    return this._presentationMode;
  }

  set presentationMode(presentationMode: PresentationMode) {
    if (presentationMode === this._presentationMode) {
      // Ignore if presentationMode did not change.
      return;
    }

    if (fullscreenAPI !== undefined) {
      // If the browser supports the fullscreenAPI, put the element that encloses the player & UI in fullscreen.
      if (presentationMode === PresentationMode.fullscreen) {
        const appElement = document.getElementById('theoplayer-root-container');
        if (appElement !== null) {
          appElement[fullscreenAPI.requestFullscreen_]()?.then?.(noOp, noOp);
        }
      } else if (presentationMode === PresentationMode.pip) {
        this._player.presentation.requestMode('native-picture-in-picture');
      } else {
        if (this._presentationMode === PresentationMode.fullscreen) {
          document[fullscreenAPI.exitFullscreen_]()?.then?.(noOp, noOp);
        }
        if (this._presentationMode === PresentationMode.pip) {
          this._player.presentation.requestMode(PresentationMode.inline);
        }
      }
    } else {
      // Some browsers, like iOS Safari, can only put a videoElement in fullscreen; let the player decide which one.
      if (presentationMode === PresentationMode.fullscreen) {
        this._player.presentation.requestMode(PresentationMode.fullscreen);
      } else if (presentationMode === PresentationMode.pip) {
        this._player.presentation.requestMode('native-picture-in-picture');
      } else {
        this._player.presentation.requestMode(PresentationMode.inline);
      }
    }
  }

  private maybePrepareForPresentationModeChanges() {
    // listen for fullscreen updates on document
    if (fullscreenAPI !== undefined) {
      document.addEventListener(fullscreenAPI.fullscreenchange_, this.updatePresentationMode);
      document.addEventListener(fullscreenAPI.fullscreenerror_, this.updatePresentationMode);
    }
  }

  private updatePresentationMode = () => {
    // detect new presentation mode
    let newPresentationMode: PresentationMode = PresentationMode.inline;
    if (
      // Check if we went into fullscreen using the fullscreen API.
      (fullscreenAPI !== undefined && document[fullscreenAPI.fullscreenElement_] !== null) ||
      // or otherwise using player APi
      this._player.presentation.currentMode === PresentationMode.fullscreen
    ) {
      newPresentationMode = PresentationMode.fullscreen;
    } else if (this._player.presentation.currentMode === 'native-picture-in-picture') {
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
