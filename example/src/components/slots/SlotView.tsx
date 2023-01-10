import React, { PureComponent, ReactNode } from 'react';
import { Animated, Platform, StyleProp, StyleSheet, TouchableOpacity, View, ViewStyle } from 'react-native';
import { PlayerContext } from '../util/Context';
import type { THEOplayerInternal } from 'react-native-theoplayer';
import { PlayerEventType } from 'react-native-theoplayer';

interface SlotViewProps {
  style?: StyleProp<ViewStyle>;
  top?: ReactNode;
  center?: ReactNode;
  bottom?: ReactNode;
}

const slotViewStyle = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
    flexDirection: 'column',
    justifyContent: 'space-between',
    zIndex: 1,
  },
  background: {
    backgroundColor: '#00000066',
  },
  topSlot: {
    paddingTop: 10,
    paddingLeft: 10,
    paddingRight: 10,
  },
  centerSlot: {},
  bottomSlot: {
    paddingBottom: 10,
    paddingLeft: 10,
    paddingRight: 10,
  },
});

interface SlotViewState {
  fadeAnim: Animated.Value;
  controlsEnabled: boolean;
}

export class SlotView extends PureComponent<React.PropsWithChildren<SlotViewProps>, SlotViewState> {
  private currentTimeout: number | undefined = undefined;

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
    this.enableControls();
    this.resetFadeOutTimeout();
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
    clearTimeout(this.currentTimeout);
    //@ts-ignore
    this.currentTimeout = setTimeout(this.fadeOut, 2000);
  };

  private fadeOut = () => {
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
    this.setState({ controlsEnabled: false });
  };

  render() {
    const { style, top, center, bottom, children } = this.props;
    const { fadeAnim, controlsEnabled } = this.state;
    return (
      <>
        <TouchableOpacity style={slotViewStyle.container} onPress={this.fadeIn} activeOpacity={0}></TouchableOpacity>
        {/* The Animated.View is for showing and hiding the UI*/}
        <Animated.View style={[slotViewStyle.container, { opacity: fadeAnim, display: controlsEnabled ? 'flex' : 'none' }]}>
          {/* The UI background */}
          <View style={[slotViewStyle.container, slotViewStyle.background]} />
          {/* The UI control bars*/}
          <View style={[slotViewStyle.container, style]} onTouchStart={this.fadeIn}>
            <View style={slotViewStyle.topSlot}>{top}</View>
            <View style={slotViewStyle.centerSlot}>{center}</View>
            <View style={slotViewStyle.bottomSlot}>{bottom}</View>
            {children}
          </View>
        </Animated.View>
      </>
    );
  }
}

SlotView.contextType = PlayerContext;
