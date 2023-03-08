import React, { PureComponent, ReactNode } from 'react';
import { Animated, Platform, View } from 'react-native';
import { PlayerContext } from '../util/PlayerContext';
import { arrayRemoveElement } from '../../utils/ArrayUtils';
import type { THEOplayer } from 'react-native-theoplayer';
import { CastEvent, CastEventType, ErrorEvent, PlayerError, PlayerEventType } from 'react-native-theoplayer';
import type { THEOplayerStyle } from '../THEOplayerStyle';
import type { MenuConstructor, UiControls } from './UiControls';
import { ErrorDisplay } from '../message/ErrorDisplay';

interface UiContainerProps {
  player: THEOplayer;
  style: THEOplayerStyle;
  top?: ReactNode;
  center?: ReactNode;
  bottom?: ReactNode;
}

interface UiContainerState {
  fadeAnimation: Animated.Value;
  currentMenu: ReactNode | undefined;
  showing: boolean;
  buttonsEnabled: boolean;
  error: PlayerError | undefined;
  firstPlay: boolean;
  paused: boolean;
}

const DEBUG_USER_IDLE_FADE = false;

export class UiContainer extends PureComponent<React.PropsWithChildren<UiContainerProps>, UiContainerState> implements UiControls {
  private _userActiveIds: number[] = [];
  private _idCounter = 0;
  private _currentFadeOutTimeout: number | undefined = undefined;

  private _menus: MenuConstructor[] = [];

  static initialState: UiContainerState = {
    fadeAnimation: new Animated.Value(1),
    currentMenu: undefined,
    showing: true,
    buttonsEnabled: true,
    error: undefined,
    firstPlay: false,
    paused: true,
  };

  constructor(props: UiContainerProps) {
    super(props);
    this.state = UiContainer.initialState;
  }

  componentDidMount() {
    const player = this.props.player;
    player.addEventListener(PlayerEventType.LOAD_START, this.onLoadStart);
    player.addEventListener(PlayerEventType.ERROR, this.onError);
    player.addEventListener(PlayerEventType.CAST_EVENT, this.onCastEvent);
    player.addEventListener(PlayerEventType.PLAY, this.onPlay);
    player.addEventListener(PlayerEventType.PLAYING, this.onPlay);
    player.addEventListener(PlayerEventType.PAUSE, this.onPause);
    player.addEventListener(PlayerEventType.SOURCE_CHANGE, this.onSourceChange);
    if (player.source !== undefined && player.currentTime !== 0) {
      this.onPlay();
    }
  }

  componentWillUnmount() {
    const player = this.props.player;
    player.removeEventListener(PlayerEventType.LOAD_START, this.onLoadStart);
    player.removeEventListener(PlayerEventType.ERROR, this.onError);
    player.removeEventListener(PlayerEventType.CAST_EVENT, this.onCastEvent);
    player.removeEventListener(PlayerEventType.PLAY, this.onPlay);
    player.removeEventListener(PlayerEventType.PLAYING, this.onPlay);
    player.removeEventListener(PlayerEventType.PAUSE, this.onPause);
    player.removeEventListener(PlayerEventType.SOURCE_CHANGE, this.onSourceChange);
  }

  private onPlay = () => {
    this.setState({ firstPlay: true, paused: false });
    this.resumeAnimationsIfPossible_();
  };

  private onPause = () => {
    this.setState({ firstPlay: true, paused: true });
    this.stopAnimationsAndShowUi_();
  };

  private onSourceChange = () => {
    this.setState({ firstPlay: false, paused: this.props.player.paused });
  };

  private onLoadStart = () => {
    this.setState({ error: undefined });
  };

  private onError = (event: ErrorEvent) => {
    const { error } = event;
    this.setState({ error });
  };

  private onCastEvent = (event: CastEvent) => {
    if (event.subType === CastEventType.CHROMECAST_ERROR)
      this.setState({
        error: {
          errorCode: event.error.errorCode,
          errorMessage: event.error.description,
        },
      });
  };

  get buttonsEnabled_(): boolean {
    return this.state.buttonsEnabled;
  }

  /**
   * Request to show the UI due to user input.
   */
  public onUserAction_ = () => {
    if (DEBUG_USER_IDLE_FADE) {
      console.log('onUserAction_', this._userActiveIds);
    }
    if (!this.state.firstPlay) {
      return;
    }
    this.stopAnimationsAndShowUi_();
    this.resumeAnimationsIfPossible_();
  };

  /**
   * Request to show the UI until releaseLock_() is called.
   */
  public setUserActive_ = () => {
    this.stopAnimationsAndShowUi_();
    const id = this._idCounter++;
    this._userActiveIds.push(id);
    if (DEBUG_USER_IDLE_FADE) {
      console.log('setUserActive_', this._userActiveIds);
    }
    return id;
  };

  /**
   * Request to release the lock and start fading out again.
   */
  public setUserIdle_ = (id?: number) => {
    arrayRemoveElement(this._userActiveIds, id);
    if (DEBUG_USER_IDLE_FADE) {
      console.log('setUserIdle_', this._userActiveIds);
    }
    this.resumeAnimationsIfPossible_();
  };

  public openMenu_ = (menuConstructor: () => ReactNode) => {
    this._menus.push(menuConstructor);
    this.setState({ currentMenu: menuConstructor() });
    this.stopAnimationsAndShowUi_();
  };

  public closeCurrentMenu_ = () => {
    this._menus.pop();
    const nextMenu = this._menus.length > 0 ? this._menus[this._menus.length - 1] : undefined;
    this.setState({ currentMenu: nextMenu?.() });
    this.resumeAnimationsIfPossible_();
  };

  private stopAnimationsAndShowUi_() {
    clearTimeout(this._currentFadeOutTimeout);
    this._currentFadeOutTimeout = undefined;
    if (!this.state.showing) {
      this.doFadeIn_();
    }
  }

  private resumeAnimationsIfPossible_() {
    if (this._userActiveIds.length === 0 && this._menus.length === 0 && !this.state.paused) {
      clearTimeout(this._currentFadeOutTimeout);
      // @ts-ignore
      this._currentFadeOutTimeout = setTimeout(this.doFadeOut_, 2500);
    }
  }

  private doFadeIn_ = () => {
    const { fadeAnimation } = this.state;
    this.setState({ showing: true });
    Animated.timing(fadeAnimation, {
      useNativeDriver: true,
      toValue: 1,
      duration: 200,
    }).start(() => {
      this.setState({ buttonsEnabled: true });
    });
  };

  private doFadeOut_ = () => {
    const { fadeAnimation } = this.state;
    this.setState({ buttonsEnabled: false });
    Animated.timing(fadeAnimation, {
      useNativeDriver: true,
      toValue: 0,
      duration: 200,
    }).start(() => {
      this.setState({ showing: false });
    });
  };

  render() {
    const { player, style, top, center, bottom, children } = this.props;
    const { fadeAnimation, currentMenu, error, firstPlay } = this.state;

    if (error !== undefined) {
      return <ErrorDisplay error={error} />;
    }

    return (
      <PlayerContext.Provider value={{ player, style: style, ui: this }}>
        {/* The Animated.View is for showing and hiding the UI*/}
        <Animated.View
          style={[style.slotView.container, { opacity: fadeAnimation }]}
          onTouchStart={this.onUserAction_}
          {...(Platform.OS === 'web' ? { onMouseMove: this.onUserAction_ } : {})}>
          <>
            {/* The UI background */}
            <View style={[style.slotView.container, { backgroundColor: style.colors.background }]} />

            {/* The Settings Menu */}
            {currentMenu !== undefined && <View style={[style.slotView.container]}>{currentMenu}</View>}

            {/* The UI control bars*/}
            {currentMenu === undefined && (
              <View style={[style.slotView.container]}>
                {firstPlay && <View style={style.slotView.topSlot}>{top}</View>}
                <View style={style.fullScreenCenter}>
                  <View style={[style.slotView.centerSlot]}>{center}</View>
                </View>
                {firstPlay && <View style={style.slotView.bottomSlot}>{bottom}</View>}
                {children}
              </View>
            )}
          </>
        </Animated.View>
      </PlayerContext.Provider>
    );
  }
}

UiContainer.contextType = PlayerContext;
