import React, { PureComponent, ReactNode } from 'react';
import { Animated, Platform, View } from 'react-native';
import { PlayerContext } from '../util/PlayerContext';
import { arrayRemoveElement } from '../../utils/ArrayUtils';
import type { AnimationController } from '../util/AnimationController';
import type { THEOplayer } from 'react-native-theoplayer';
import type { VideoPlayerStyle } from '../style/VideoPlayerStyle';

interface SlotViewProps {
  player: THEOplayer;
  style: VideoPlayerStyle;
  top?: ReactNode;
  center?: ReactNode;
  bottom?: ReactNode;
}

interface SlotViewState {
  fadeAnim: Animated.Value;
}

export class UiController extends PureComponent<React.PropsWithChildren<SlotViewProps>, SlotViewState> implements AnimationController {
  private _animationsPauseRequestIds: number[] = [];
  private _idCounter = 0;
  private _showing = true;
  private _currentFadeOutTimeout: number | undefined = undefined;

  constructor(props: SlotViewProps) {
    super(props);
    this.state = {
      fadeAnim: new Animated.Value(1),
    };
  }

  get showing_(): boolean {
    return this._showing;
  }

  /**
   * Request to show the UI due to user input.
   */
  public requestShowUi = () => {
    this.releaseLock_(this.requestShowUiWithLock_());
  };

  /**
   * Request to show the UI until releaseLock_() is called.
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
   * Request to release the lock and start fading out again.
   */
  public releaseLock_(id: number) {
    arrayRemoveElement(this._animationsPauseRequestIds, id);
    if (this._animationsPauseRequestIds.length === 0) {
      clearTimeout(this._currentFadeOutTimeout);
      // @ts-ignore
      this._currentFadeOutTimeout = setTimeout(this._doFadeOut, 2000);
    }
  }

  private _doFadeIn = () => {
    const { fadeAnim } = this.state;
    this._showing = true;
    Animated.timing(fadeAnim, {
      useNativeDriver: true,
      toValue: 1,
      duration: 200,
    }).start();
  };

  private _doFadeOut = () => {
    const { fadeAnim } = this.state;
    this._showing = false;
    Animated.timing(fadeAnim, {
      useNativeDriver: true,
      toValue: 0,
      duration: 1000,
    }).start();
  };

  render() {
    const { player, style, top, center, bottom, children } = this.props;
    const { fadeAnim } = this.state;
    return (
      <PlayerContext.Provider value={{ player, style: style, animation: this }}>
        {/* The Animated.View is for showing and hiding the UI*/}
        <Animated.View
          style={[style.slotView.container, { opacity: fadeAnim }]}
          onTouchStart={this.requestShowUi}
          {...(Platform.OS === 'web' ? { onMouseMove: this.requestShowUi } : {})}>
          {/* The UI background */}
          <View style={[style.slotView.container, style.slotView.background]} />
          {/* The UI control bars*/}
          <View style={[style.slotView.container]}>
            <View style={style.slotView.topSlot}>{top}</View>
            {/* The center controls*/}
            <View style={[style.slotView.centerSlot]}>{center}</View>
            <View style={style.slotView.bottomSlot}>{bottom}</View>
            {children}
          </View>
        </Animated.View>
      </PlayerContext.Provider>
    );
  }
}

UiController.contextType = PlayerContext;
