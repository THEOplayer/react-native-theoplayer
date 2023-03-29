import React, { PureComponent, ReactNode } from 'react';
import { Animated, Platform, StyleProp, View, ViewStyle } from 'react-native';
import { PlayerContext } from '../util/PlayerContext';
import { arrayRemoveElement } from '../../utils/ArrayUtils';
import type { PresentationModeChangeEvent, THEOplayer } from 'react-native-theoplayer';
import { CastEvent, CastEventType, ErrorEvent, PlayerError, PlayerEventType } from 'react-native-theoplayer';
import type { THEOplayerTheme } from '../THEOplayerTheme';
import type { MenuConstructor, UiControls } from './UiControls';
import { ErrorDisplay } from '../message/ErrorDisplay';

interface UiContainerProps {
  player: THEOplayer;
  theme: THEOplayerTheme;
  style?: StyleProp<ViewStyle>;
  topStyle?: StyleProp<ViewStyle>;
  centerStyle?: StyleProp<ViewStyle>;
  bottomStyle?: StyleProp<ViewStyle>;
  top?: ReactNode;
  center?: ReactNode;
  bottom?: ReactNode;
  behind?: ReactNode;
}

interface UiContainerState {
  fadeAnimation: Animated.Value;
  currentMenu: ReactNode | undefined;
  showing: boolean;
  buttonsEnabled: boolean;
  error: PlayerError | undefined;
  firstPlay: boolean;
  paused: boolean;
  casting: boolean;
  pip: boolean;
}

const DEBUG_USER_IDLE_FADE = false;

export const FULLSCREEN_CENTER_STYLE: ViewStyle = {
  position: 'absolute',
  top: 0,
  left: 0,
  bottom: 0,
  right: 0,
  alignItems: 'center',
  justifyContent: 'center',
};

export const CONTAINER_STYLE: ViewStyle = {
  position: 'absolute',
  top: 0,
  left: 0,
  bottom: 0,
  right: 0,
  flexDirection: 'column',
  justifyContent: 'space-between',
  zIndex: 1,
  overflow: 'hidden',
};

export const TOP_CONTAINER_STYLE: ViewStyle = {
  zIndex: 2,
  paddingTop: 10,
  paddingLeft: 10,
  paddingRight: 10,
};

export const BOTTOM_CONTAINER_STYLE: ViewStyle = {
  zIndex: 2,
  paddingBottom: 10,
  paddingLeft: 10,
  paddingRight: 10,
};

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
    casting: false,
    pip: false,
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
    player.addEventListener(PlayerEventType.CAST_EVENT, this.onCastEvent);
    player.addEventListener(PlayerEventType.ENDED, this.onEnded);
    player.addEventListener(PlayerEventType.PRESENTATIONMODE_CHANGE, this.onPresentationModeChange);
    if (player.source !== undefined && player.currentTime !== 0) {
      this.onPlay();
    }
    this.setState({ pip: player.presentationMode === 'picture-in-picture' });
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
    player.removeEventListener(PlayerEventType.CAST_EVENT, this.onCastEvent);
    player.removeEventListener(PlayerEventType.ENDED, this.onEnded);
    player.removeEventListener(PlayerEventType.PRESENTATIONMODE_CHANGE, this.onPresentationModeChange);
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
    if (event.subType === CastEventType.CHROMECAST_STATE_CHANGE || event.subType === CastEventType.AIRPLAY_STATE_CHANGE) {
      this.setState({ casting: event.state === 'connecting' || event.state === 'connected' });
    }
  };

  private onEnded = () => {
    this.stopAnimationsAndShowUi_();
  };

  private onPresentationModeChange = (event: PresentationModeChangeEvent) => {
    this.setState({ pip: event.presentationMode === 'picture-in-picture' });
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
    if (this._userActiveIds.length === 0 && this._menus.length === 0 && !this.state.paused && !this.state.casting) {
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
    const { player, theme, top, center, bottom, children, style, topStyle, bottomStyle, behind } = this.props;
    const { fadeAnimation, currentMenu, error, firstPlay, pip } = this.state;

    if (error !== undefined) {
      return <ErrorDisplay error={error} />;
    }

    if (Platform.OS !== 'web' && pip) {
      return <></>;
    }

    const combinedContainerStyle = [CONTAINER_STYLE, style];

    return (
      <PlayerContext.Provider value={{ player, style: theme, ui: this }}>
        {/* The View behind the UI, that is always visible.*/}
        <View style={FULLSCREEN_CENTER_STYLE}>{behind}</View>
        {/* The Animated.View is for showing and hiding the UI*/}
        <Animated.View
          style={[combinedContainerStyle, { opacity: fadeAnimation }]}
          onTouchStart={this.onUserAction_}
          {...(Platform.OS === 'web' ? { onMouseMove: this.onUserAction_ } : {})}>
          <>
            {/* The UI background */}
            <View style={[combinedContainerStyle, { backgroundColor: theme.colors.background }]} />

            {/* The Settings Menu */}
            {currentMenu !== undefined && <View style={[combinedContainerStyle]}>{currentMenu}</View>}

            {/* The UI control bars*/}
            {currentMenu === undefined && (
              <View style={[combinedContainerStyle]}>
                {firstPlay && <View style={[TOP_CONTAINER_STYLE, topStyle]}>{top}</View>}
                <View style={FULLSCREEN_CENTER_STYLE}>{center}</View>
                {firstPlay && <View style={[BOTTOM_CONTAINER_STYLE, bottomStyle]}>{bottom}</View>}
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
