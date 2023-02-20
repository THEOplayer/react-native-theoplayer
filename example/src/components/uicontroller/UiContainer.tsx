import React, { PureComponent, ReactNode } from 'react';
import { Animated, Platform, View } from 'react-native';
import { PlayerContext } from '../util/PlayerContext';
import { arrayRemoveElement } from '../../utils/ArrayUtils';
import type { THEOplayer } from 'react-native-theoplayer';
import type { VideoPlayerStyle } from '../style/VideoPlayerStyle';
import type { UiControls } from './UiControls';

interface SlotViewProps {
  player: THEOplayer;
  style: VideoPlayerStyle;
  top?: ReactNode;
  center?: ReactNode;
  bottom?: ReactNode;
}

interface SlotViewState {
  fadeAnim: Animated.Value;
  currentMenu: ReactNode | undefined;
}

export class UiContainer extends PureComponent<React.PropsWithChildren<SlotViewProps>, SlotViewState> implements UiControls {
  private _animationsPauseRequestIds: number[] = [];
  private _idCounter = 0;
  private _showing = true;
  private _currentFadeOutTimeout: number | undefined = undefined;

  private _menuLockId: number | undefined = undefined;

  constructor(props: SlotViewProps) {
    super(props);
    this.state = {
      fadeAnim: new Animated.Value(1),
      currentMenu: undefined,
    };
  }

  get showing_(): boolean {
    return this._showing;
  }

  /**
   * Request to show the UI due to user input.
   */
  public requestShowUi = () => {
    this.showUi_();
    this.hideUiAfterTimeout_();
  };

  /**
   * Request to show the UI until releaseLock_() is called.
   */
  public requestShowUiWithLock_ = () => {
    this.showUi_();
    const id = this._idCounter++;
    this._animationsPauseRequestIds.push(id);
    return id;
  };

  /**
   * Request to release the lock and start fading out again.
   */
  public releaseLock_ = (id?: number) => {
    arrayRemoveElement(this._animationsPauseRequestIds, id);
    this.hideUiAfterTimeout_();
  };

  public setMenu_ = (menu: ReactNode | undefined) => {
    const { currentMenu } = this.state;
    const previousMenu = currentMenu;
    if (this._menuLockId !== undefined) {
      this.releaseLock_(this._menuLockId);
    }
    if (menu !== undefined) {
      this._menuLockId = this.requestShowUiWithLock_();
    }
    this.setState({ currentMenu: menu });
    return previousMenu;
  };

  private showUi_() {
    clearTimeout(this._currentFadeOutTimeout);
    this._currentFadeOutTimeout = undefined;
    if (!this._showing) {
      this.doFadeIn_();
    }
  }

  private hideUiAfterTimeout_() {
    if (this._animationsPauseRequestIds.length === 0) {
      clearTimeout(this._currentFadeOutTimeout);
      // @ts-ignore
      this._currentFadeOutTimeout = setTimeout(this.doFadeOut_, 2000);
    }
  }

  private doFadeIn_ = () => {
    const { fadeAnim } = this.state;
    Animated.timing(fadeAnim, {
      useNativeDriver: true,
      toValue: 1,
      duration: 200,
    }).start(() => {
      this._showing = true;
    });
  };

  private doFadeOut_ = () => {
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
    const { fadeAnim, currentMenu } = this.state;
    return (
      <PlayerContext.Provider value={{ player, style: style, ui: this }}>
        {/* The Animated.View is for showing and hiding the UI*/}
        <Animated.View
          style={[style.slotView.container, { opacity: fadeAnim }]}
          onTouchStart={this.requestShowUi}
          {...(Platform.OS === 'web' ? { onMouseMove: this.requestShowUi } : {})}>
          {/* The UI background */}
          <View style={[style.slotView.container, style.slotView.background]} />

          {/* The Settings Menu */}
          {currentMenu !== undefined && <View style={[style.slotView.container]}>{currentMenu}</View>}

          {/* The UI control bars*/}
          <View style={[style.slotView.container, { display: currentMenu !== undefined ? 'none' : 'flex' }]}>
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

UiContainer.contextType = PlayerContext;
