import React, { PureComponent, ReactNode } from 'react';
import { Animated, Platform, StyleProp, View, ViewStyle } from 'react-native';
import { PlayerContext } from '../util/Context';
import type { THEOplayerInternal } from 'react-native-theoplayer';
import { PlayerEventType } from 'react-native-theoplayer';
import { PlayerStyleContext, VideoPlayerStyle } from '../style/VideoPlayerStyle';

interface SlotViewProps {
  style?: StyleProp<ViewStyle>;
  top?: ReactNode;
  center?: ReactNode;
  bottom?: ReactNode;
}

interface SlotViewState {
  fadeAnim: Animated.Value;
  controlsEnabled: boolean;
}

export class SlotView extends PureComponent<React.PropsWithChildren<SlotViewProps>, SlotViewState> {
  private currentFadeOutTimeout: number | undefined = undefined;

  constructor(props: SlotViewProps) {
    super(props);
    this.state = {
      fadeAnim: new Animated.Value(1),
      controlsEnabled: true,
    };
  }

  componentDidMount() {
    const player = this.context as THEOplayerInternal;
    player.addEventListener(PlayerEventType.PLAY, this.resetFadeOutTimeout);
  }

  componentWillUnmount() {
    const player = this.context as THEOplayerInternal;
    player.addEventListener(PlayerEventType.PLAY, this.resetFadeOutTimeout);
  }

  private fadeIn = () => {
    if (Platform.isTV) {
      // TODO fade effects for TV UI.
      return;
    }
    const { fadeAnim } = this.state;
    this.resetFadeOutTimeout();
    this.enableControls();
    Animated.timing(fadeAnim, {
      useNativeDriver: true,
      toValue: 1,
      duration: 200,
    }).start();
  };

  private resetFadeOutTimeout = () => {
    if (Platform.isTV) {
      // TODO fade effects for TV UI.
      return;
    }
    clearTimeout(this.currentFadeOutTimeout);
    //@ts-ignore
    this.currentFadeOutTimeout = setTimeout(this.fadeOut, 2000);
  };

  private fadeOut = () => {
    this.currentFadeOutTimeout = undefined;
    if (this.context.paused) {
      // Player is paused, don't hide the UI.
      return;
    }
    const { fadeAnim } = this.state;
    Animated.timing(fadeAnim, {
      useNativeDriver: true,
      toValue: 0,
      duration: 1000,
    }).start(this.disableControls);
  };

  private enableControls = () => {
    this.setState({ controlsEnabled: true });
  };

  private disableControls = () => {
    if (!this.currentFadeOutTimeout) {
      this.setState({ controlsEnabled: false });
    }
  };

  render() {
    const { style, top, center, bottom, children } = this.props;
    const { fadeAnim, controlsEnabled } = this.state;
    return (
      <PlayerStyleContext.Consumer>
        {(styleContext: VideoPlayerStyle) => (
          <>
            <View style={styleContext.containerSlotView} onTouchStart={this.fadeIn}></View>
            {/* The Animated.View is for showing and hiding the UI*/}
            <Animated.View
              style={[styleContext.containerSlotView, { opacity: fadeAnim, display: controlsEnabled ? 'flex' : 'none' }]}
              onTouchStart={this.fadeIn}>
              {/* The UI background */}
              <View style={[styleContext.containerSlotView, styleContext.backgroundSlotView]} />
              {/* The UI control bars*/}
              <View style={[styleContext.containerSlotView, style]}>
                <View style={styleContext.topSlot}>{top}</View>
                {/* The center controls*/}
                <View style={[styleContext.centerSlot]}>{center}</View>
                <View style={styleContext.bottomSlot}>{bottom}</View>
                {children}
              </View>
            </Animated.View>
          </>
        )}
      </PlayerStyleContext.Consumer>
    );
  }
}

SlotView.contextType = PlayerContext;
