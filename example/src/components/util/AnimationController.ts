import { DefaultEventDispatcher } from '../../event/DefaultEventDispatcher';
import type { Event } from '../../event/Event';
import { BaseEvent } from '../../event/BaseEvent';
import { arrayRemoveElement } from '../../utils/ArrayUtils';

export interface AnimationControllerEventMap {
  startFadingOut: Event<'startFadingOut'>;

  startFadingIn: Event<'startFadingIn'>;
}

export class AnimationController extends DefaultEventDispatcher<AnimationControllerEventMap> {
  private _animationsPauseRequestIds: number[] = [];
  private _idCounter = 0;
  private _showing = true;
  private _currentFadeOutTimeout: number | undefined = undefined;

  public requestShowUi = () => {
    this.releaseLock_(this.requestShowUiWithLock_());
  };

  /**
   * Request to stop fading out until releaseLock_() is called.
   */
  public requestShowUiWithLock_(): number {
    clearTimeout(this._currentFadeOutTimeout);
    this._currentFadeOutTimeout = undefined;
    if (!this._showing) {
      this._doFadeIn();
    }
    const id = this._idCounter++;
    this._animationsPauseRequestIds.push(id);
    return id;
  }

  /**
   * Request to start fading in and out again.
   */
  public releaseLock_(id?: number) {
    if (id !== undefined) {
      arrayRemoveElement(this._animationsPauseRequestIds, id);
    }
    if (this._animationsPauseRequestIds.length === 0) {
      clearTimeout(this._currentFadeOutTimeout);
      // @ts-ignore
      this._currentFadeOutTimeout = setTimeout(this._doFadeOut, 2000);
    }
  }

  private _doFadeIn = () => {
    this._showing = true;
    this.dispatchEvent(new BaseEvent('startFadingIn'));
  };

  private _doFadeOut = () => {
    this._showing = false;
    this.dispatchEvent(new BaseEvent('startFadingOut'));
  };
}
