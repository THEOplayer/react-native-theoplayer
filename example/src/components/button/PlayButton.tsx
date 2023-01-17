import { ActionButton } from './actionbutton/ActionButton';
import { Platform, StyleProp, ViewStyle } from 'react-native';
import React, { PureComponent } from 'react';
import { PlayerEventType, THEOplayerInternal } from 'react-native-theoplayer';
import { PlayerContext, PlayerWithStyle } from '../util/PlayerContext';
import { PlayButtonSvg } from './svg/PlayButtonSvg';
import { PauseButtonSvg } from './svg/PauseButtonSvg';

interface PlayButtonProps {
  style?: StyleProp<ViewStyle>;
}

interface PlayButtonState {
  paused: boolean;
  error: boolean;
}

export class PlayButton extends PureComponent<PlayButtonProps, PlayButtonState> {
  private animationPauseId: number | undefined = undefined;

  constructor(props: PlayButtonProps) {
    super(props);
    this.state = {
      paused: true,
      error: false,
    };
  }

  componentDidMount() {
    const player = this.context.player as THEOplayerInternal;
    player.addEventListener(PlayerEventType.PLAY, this.onPlay);
    player.addEventListener(PlayerEventType.PLAYING, this.onPlay);
    player.addEventListener(PlayerEventType.PAUSE, this.onPause);
    player.addEventListener(PlayerEventType.ERROR, this.onError);
    player.addEventListener(PlayerEventType.SOURCE_CHANGE, this.onSourceChange);
  }

  componentWillUnmount() {
    const player = this.context.player as THEOplayerInternal;
    player.removeEventListener(PlayerEventType.PLAY, this.onPlay);
    player.removeEventListener(PlayerEventType.PLAYING, this.onPlay);
    player.removeEventListener(PlayerEventType.PAUSE, this.onPause);
    player.removeEventListener(PlayerEventType.ERROR, this.onError);
    player.removeEventListener(PlayerEventType.SOURCE_CHANGE, this.onSourceChange);
  }

  private onPlay = () => {
    this.setState({ paused: false });
    this.context.animation.requestResumeAnimations(this.animationPauseId);
    this.animationPauseId = undefined;
  };

  private onPause = () => {
    this.setState({ paused: true });
    if (this.animationPauseId === undefined) {
      this.animationPauseId = this.context.animation.requestPause();
    }
  };

  private onError = () => {
    this.setState({ error: true });
  };

  private onSourceChange = () => {
    this.setState({ error: false });
  };

  private togglePlayPause = () => {
    const player = this.context.player as THEOplayerInternal;
    if (player.paused) {
      player.play();
    } else {
      player.pause();
    }
  };

  render() {
    const { paused, error } = this.state;
    const { style } = this.props;
    if (error) {
      return <></>;
    }

    return (
      <PlayerContext.Consumer>
        {(context: PlayerWithStyle) => (
          <ActionButton
            style={context.style.controlBar.buttonIcon}
            touchable={!Platform.isTV}
            svg={paused ? <PlayButtonSvg /> : <PauseButtonSvg />}
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
