import { ActionButton } from './actionbutton/ActionButton';
import React, { PureComponent } from 'react';
import { PlayerContext, UiContext } from '../util/PlayerContext';
import { ForwardSvg } from './svg/ForwardSvg';
import type { StyleProp, ViewStyle } from 'react-native';
import { Animated, Easing, Text } from 'react-native';
import { BackwardSvg } from './svg/BackwardSvg';
import { PlayerEventType, ProgressEvent } from 'react-native-theoplayer';

interface SkipButtonProps {
  style?: StyleProp<ViewStyle>;
  skip: number;
}

interface SkipButtonState {
  enabled: boolean;
  spinValue: Animated.Value;
}

export class SkipButton extends PureComponent<SkipButtonProps, SkipButtonState> {
  constructor(props: SkipButtonProps) {
    super(props);
    this.state = { enabled: false, spinValue: new Animated.Value(0) };
  }

  componentDidMount() {
    const player = (this.context as UiContext).player;
    player.addEventListener(PlayerEventType.PROGRESS, this.onTimeupdate);
    this.setState({ enabled: player.seekable.length > 0 });
  }

  componentWillUnmount() {
    const player = (this.context as UiContext).player;
    player.removeEventListener(PlayerEventType.PROGRESS, this.onTimeupdate);
  }

  private readonly onTimeupdate = (event: ProgressEvent) => {
    this.setState({ enabled: event.seekable.length > 0 });
  };

  private readonly onPress = () => {
    const { skip } = this.props;
    const { spinValue } = this.state;
    const player = (this.context as UiContext).player;
    player.currentTime = player.currentTime + skip * 1e3;

    Animated.timing(spinValue, {
      toValue: 0.1,
      duration: 100,
      easing: Easing.linear,
      useNativeDriver: true,
    }).start(() => {
      Animated.timing(spinValue, {
        toValue: 0,
        duration: 100,
        easing: Easing.linear,
        useNativeDriver: true,
      }).start();
    });
  };

  render() {
    const { style, skip } = this.props;
    const { enabled, spinValue } = this.state;

    if (!enabled) {
      return <></>;
    }

    const spin = spinValue.interpolate({
      inputRange: [0, 1],
      outputRange: skip >= 0 ? ['0deg', '360deg'] : ['360deg', '0deg'],
    });
    return (
      <>
        <PlayerContext.Consumer>
          {(context: UiContext) => (
            <Animated.View style={[style, { transform: [{ rotate: spin }] }]}>
              <ActionButton touchable={true} svg={skip < 0 ? <BackwardSvg /> : <ForwardSvg />} onPress={this.onPress} />
              <Text style={[context.style.text, { position: 'absolute', paddingTop: '33%', color: context.style.colors.text, zIndex: -1 }]}>
                {Math.abs(skip)}
              </Text>
            </Animated.View>
          )}
        </PlayerContext.Consumer>
      </>
    );
  }
}

SkipButton.contextType = PlayerContext;
