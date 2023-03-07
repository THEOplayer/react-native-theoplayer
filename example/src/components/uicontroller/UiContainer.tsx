import React, { PureComponent, ReactNode } from 'react';
import { Animated, Platform, View } from 'react-native';
import { PlayerContext, UiContext } from '../util/PlayerContext';
import { arrayRemoveElement } from '../../utils/ArrayUtils';
import type { THEOplayer } from 'react-native-theoplayer';
import type { VideoPlayerStyle } from '../style/VideoPlayerStyle';
import type { MenuConstructor, UiControls } from './UiControls';
import { CastEvent, CastEventType, ErrorEvent, PlayerError, PlayerEventType } from 'react-native-theoplayer';
import { ErrorDisplay } from '../view/ErrorDisplay';

interface SlotViewProps {
  player: THEOplayer;
  style: VideoPlayerStyle;
  top?: ReactNode;
  center?: ReactNode;
  bottom?: ReactNode;
}

interface SlotViewState {
  fadeAnimation: Animated.Value;
  currentMenu: ReactNode | undefined;
  showing: boolean;
  buttonsEnabled: boolean;
  error: PlayerError | undefined;
}

const DEBUG_USER_IDLE_FADE = false;

export class UiContainer extends PureComponent<React.PropsWithChildren<SlotViewProps>, SlotViewState> implements UiControls {
  private _userActiveIds: number[] = [];
  private _idCounter = 0;
  private _currentFadeOutTimeout: number | undefined = undefined;

  private _menus: MenuConstructor[] = [];
  private _menuLockId: number | undefined = undefined;

  constructor(props: SlotViewProps) {
    super(props);
    this.state = {
      fadeAnimation: new Animated.Value(1),
      currentMenu: undefined,
      showing: true,
      buttonsEnabled: true,
      error: undefined,
    };
  }

  componentDidMount() {
    const player = this.props.player;
    player.addEventListener(PlayerEventType.LOAD_START, this.onLoadStart);
    player.addEventListener(PlayerEventType.ERROR, this.onError);
    player.addEventListener(PlayerEventType.CAST_EVENT, this.onCastEvent);
  }

  componentWillUnmount() {
    const player = this.props.player;
    player.removeEventListener(PlayerEventType.LOAD_START, this.onLoadStart);
    player.removeEventListener(PlayerEventType.ERROR, this.onError);
    player.removeEventListener(PlayerEventType.CAST_EVENT, this.onCastEvent);
  }

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
    this.showUi_();
    this.hideUiAfterTimeout_();
  };

  /**
   * Request to show the UI until releaseLock_() is called.
   */
  public setUserActive_ = () => {
    this.showUi_();
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
    this.hideUiAfterTimeout_();
  };

  public openMenu_ = (menuConstructor: () => ReactNode) => {
    this._menus.push(menuConstructor);
    if (this._menuLockId === undefined) {
      this._menuLockId = this.setUserActive_();
    }
    this.setState({ currentMenu: menuConstructor() });
  };

  public closeCurrentMenu_ = () => {
    this._menus.pop();
    const nextMenu = this._menus.length > 0 ? this._menus[this._menus.length - 1] : undefined;
    this.setState({ currentMenu: nextMenu?.() });
    if (nextMenu === undefined) {
      this.setUserIdle_(this._menuLockId);
      this._menuLockId = undefined;
    }
    this.onUserAction_();
  };

  private showUi_() {
    clearTimeout(this._currentFadeOutTimeout);
    this._currentFadeOutTimeout = undefined;
    if (!this.state.showing) {
      this.doFadeIn_();
    }
  }

  private hideUiAfterTimeout_() {
    if (this._userActiveIds.length === 0) {
      clearTimeout(this._currentFadeOutTimeout);
      // @ts-ignore
      this._currentFadeOutTimeout = setTimeout(this.doFadeOut_, 2000);
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
      duration: 1000,
    }).start(() => {
      this.setState({ showing: false });
    });
  };

  render() {
    const { player, style, top, center, bottom, children } = this.props;
    const { fadeAnimation, currentMenu, error } = this.state;

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
                <View style={style.slotView.topSlot}>{top}</View>
                <View style={style.fullScreenCenter}>
                  <View style={[style.slotView.centerSlot]}>{center}</View>
                </View>
                <View style={style.slotView.bottomSlot}>{bottom}</View>
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
