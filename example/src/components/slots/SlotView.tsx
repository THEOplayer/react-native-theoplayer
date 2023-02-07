import React, { PureComponent, ReactNode } from 'react';
import { Animated, Platform, StyleProp, View, ViewStyle } from 'react-native';
import { PlayerContext, PlayerWithStyle } from '../util/PlayerContext';
import { AnimationController } from '../util/AnimationController';

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
  constructor(props: SlotViewProps) {
    super(props);
    this.state = {
      fadeAnim: new Animated.Value(1),
      controlsEnabled: true,
    };
  }

  componentDidMount() {
    const context = this.context as PlayerWithStyle;
    context.animation.addEventListener('startFadingIn', this.fadeIn);
    context.animation.addEventListener('startFadingOut', this.fadeOut);
  }

  componentWillUnmount() {
    const context = this.context as PlayerWithStyle;
    context.animation.removeEventListener('startFadingIn', this.fadeIn);
    context.animation.removeEventListener('startFadingOut', this.fadeOut);
  }

  private fadeIn = () => {
    const { fadeAnim } = this.state;
    Animated.timing(fadeAnim, {
      useNativeDriver: true,
      toValue: 1,
      duration: 200,
    }).start();
  };

  private fadeOut = () => {
    const { fadeAnim } = this.state;
    Animated.timing(fadeAnim, {
      useNativeDriver: true,
      toValue: 0,
      duration: 1000,
    }).start(this.onFadeOutFinished);
  };

  private onFadeOutFinished = () => {
    // this.setState({ controlsEnabled: false }); TODO: disable controls when faded out?
  };

  render() {
    const { style, top, center, bottom, children } = this.props;
    const { fadeAnim } = this.state;
    const animationController = this.context.animation as AnimationController;
    return (
      <PlayerContext.Consumer>
        {(context: PlayerWithStyle) => (
          <>
            {/* The Animated.View is for showing and hiding the UI*/}
            <Animated.View
              style={[context.style.slotView.container, { opacity: fadeAnim }]}
              onTouchStart={animationController.requestShowUi}
              {...(Platform.OS === 'web' ? { onMouseMove: animationController.requestShowUi } : {})}>
              {/* The UI background */}
              <View style={[context.style.slotView.container, context.style.slotView.background]} />
              {/* The UI control bars*/}
              <View style={[context.style.slotView.container, style]}>
                <View style={context.style.slotView.topSlot}>{top}</View>
                {/* The center controls*/}
                <View style={[context.style.slotView.centerSlot]}>{center}</View>
                <View style={context.style.slotView.bottomSlot}>{bottom}</View>
                {children}
              </View>
            </Animated.View>
          </>
        )}
      </PlayerContext.Consumer>
    );
  }
}

SlotView.contextType = PlayerContext;
