import { ActionButton } from './actionbutton/ActionButton';
import React, { PureComponent } from 'react';
import { PlayerContext, UiContext } from '../util/PlayerContext';
import { ForwardSvg } from './svg/ForwardSvg';
import type { StyleProp, ViewStyle } from 'react-native';
import { Text, View } from 'react-native';
import { BackwardSvg } from './svg/BackwardSvg';
import { PlayerEventType, ProgressEvent } from 'react-native-theoplayer';

interface SkipButtonProps {
  style?: StyleProp<ViewStyle>;
  skip: number;
}

interface SkipButtonState {
  enabled: boolean;
}

export class SkipButton extends PureComponent<SkipButtonProps, SkipButtonState> {
  constructor(props: SkipButtonProps) {
    super(props);
    this.state = { enabled: false };
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

  render() {
    const { style, skip } = this.props;
    const { enabled } = this.state;

    if (!enabled) {
      return <></>;
    }

    const onPress = () => {
      const player = (this.context as UiContext).player;
      console.log(player.currentTime);
      player.currentTime = player.currentTime + skip * 1e3;
    };
    return (
      <>
        <PlayerContext.Consumer>
          {(context: UiContext) => (
            <View style={style}>
              <ActionButton
                style={context.style.controlBar.buttonIcon}
                touchable={true}
                svg={skip < 0 ? <BackwardSvg /> : <ForwardSvg />}
                // @ts-ignore
                iconStyle={[style]}
                onPress={onPress}
              />
              <Text style={[context.style.text, { position: 'absolute', paddingTop: '33%', color: context.style.colors.text, zIndex: -1 }]}>
                {Math.abs(skip)}
              </Text>
            </View>
          )}
        </PlayerContext.Consumer>
      </>
    );
  }
}

SkipButton.contextType = PlayerContext;
