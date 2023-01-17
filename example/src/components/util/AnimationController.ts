import { DefaultEventDispatcher } from '../../event/DefaultEventDispatcher';
import type { Event } from '../../event/Event';
import { BaseEvent } from '../../event/BaseEvent';
import { arrayRemoveElement } from '../../utils/ArrayUtils';

export interface AnimationControllerEventMap {
  startFadingOut: Event<'startFadingOut'>;

  startFadingIn: Event<'startFadingIn'>;
}

export class AnimationController extends DefaultEventDispatcher<AnimationControllerEventMap> {
  private animationsPauseRequestIds: number[] = [];
  private idCounter = 0;

  private currentFadeOutTimeout: number | undefined = undefined;

  /**
   * Request to stop fading out until requestContinue() is called.
   */
  public requestPause(): number {
    clearTimeout(this.currentFadeOutTimeout);
    if (this.animationsPauseRequestIds.length === 0) {
      this.dispatchEvent(new BaseEvent('startFadingIn'));
    }
    const id = this.idCounter++;
    this.animationsPauseRequestIds.push(id);
    return id;
  }

  /**
   * Request to start fading in and out again.
   */
  public requestResumeAnimations(id?: number) {
    if (id !== undefined) {
      arrayRemoveElement(this.animationsPauseRequestIds, id);
    }
    if (this.animationsPauseRequestIds.length === 0) {
      clearTimeout(this.currentFadeOutTimeout);
      // @ts-ignore
      this.currentFadeOutTimeout = setTimeout(this.fadeOut, 2000);
    }
  }

  public fadeOut = () => {
    console.log('animation continue');
    this.dispatchEvent(new BaseEvent('startFadingOut'));
  };

  public onTouch = () => {
    this.requestResumeAnimations(this.requestPause());
  };
}
