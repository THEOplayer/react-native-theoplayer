import { ActionButton } from './actionbutton/ActionButton';
import type { StyleProp, ViewStyle } from 'react-native';
import React, { PureComponent } from 'react';
import { PlayerEventType } from 'react-native-theoplayer';
import { PlayerContext, UiContext } from '../util/PlayerContext';
import { PlaySvg } from './svg/PlaySvg';

import { PauseSvg } from './svg/PauseSvg';
import { ReplaySvg } from './svg/ReplaySvg';

interface PlayButtonProps {
  style?: StyleProp<ViewStyle>;
}

interface PlayButtonState {
  paused: boolean;
  ended: boolean;
}

export class PlayButton extends PureComponent<PlayButtonProps, PlayButtonState> {
  constructor(props: PlayButtonProps) {
    super(props);
    this.state = {
      paused: true,
      ended: false,
    };
  }

  componentDidMount() {
    const context = this.context as UiContext;
    context.player.addEventListener(PlayerEventType.PLAY, this.onPlay);
    context.player.addEventListener(PlayerEventType.PLAYING, this.onPlay);
    context.player.addEventListener(PlayerEventType.PAUSE, this.onPause);
    context.player.addEventListener(PlayerEventType.SOURCE_CHANGE, this.onSourceChange);
    context.player.addEventListener(PlayerEventType.ENDED, this.onEnded);
    this.setState({
      paused: context.player.paused,
      ended: context.player.currentTime === context.player.duration,
    });
  }

  componentWillUnmount() {
    const context = this.context as UiContext;
    context.player.removeEventListener(PlayerEventType.PLAY, this.onPlay);
    context.player.removeEventListener(PlayerEventType.PLAYING, this.onPlay);
    context.player.removeEventListener(PlayerEventType.PAUSE, this.onPause);
    context.player.removeEventListener(PlayerEventType.SOURCE_CHANGE, this.onSourceChange);
    context.player.removeEventListener(PlayerEventType.ENDED, this.onEnded);
  }

  private onPlay = () => {
    this.setState({ paused: false, ended: false });
  };

  private onPause = () => {
    this.setState({ paused: true });
  };

  private onSourceChange = () => {
    const player = (this.context as UiContext).player;
    this.setState({ paused: player.paused });
  };

  private onEnded = () => {
    this.setState({ ended: true });
  };

  private togglePlayPause = () => {
    const player = (this.context as UiContext).player;
    if (player.paused) {
      player.play();
    } else {
      player.pause();
    }
  };

  render() {
    const { paused, ended } = this.state;
    const { style } = this.props;

    return (
      <PlayerContext.Consumer>
        {(context: UiContext) => (
          <ActionButton
            style={context.style.controlBar.buttonIcon}
            touchable={true}
            svg={ended ? <ReplaySvg /> : paused ? <PlaySvg /> : <PauseSvg />}
            // @ts-ignore
            iconStyle={[style]}
            onPress={this.togglePlayPause}
          />
        )}
      </PlayerContext.Consumer>
    );
  }
}

PlayButton.contextType = PlayerContext;
