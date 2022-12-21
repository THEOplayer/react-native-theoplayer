import { ActionButton } from './actionbutton/ActionButton';
import { Platform } from 'react-native';
import { PlayButton } from '../../res/images';
import React, { PureComponent } from 'react';
import { PlayerEventType, THEOplayerInternal } from 'react-native-theoplayer';
import styles from '../videoplayer/VideoPlayerUI.style';
import { PlayerContext } from '../util/Context';

interface BigPlayButtonState {
  paused: boolean;
  error: boolean;
}

export class BigPlayButton extends PureComponent<unknown, BigPlayButtonState> {
  constructor(props: unknown) {
    super(props);
    this.state = {
      paused: true,
      error: false,
    };
  }

  componentDidMount() {
    const player = this.context as THEOplayerInternal;
    player.addEventListener(PlayerEventType.PLAY, this.onPlay);
    player.addEventListener(PlayerEventType.PLAYING, this.onPlay);
    player.addEventListener(PlayerEventType.PAUSE, this.onPause);
    player.addEventListener(PlayerEventType.ERROR, this.onError);
    player.addEventListener(PlayerEventType.SOURCE_CHANGE, this.onSourceChange);
  }

  componentWillUnmount() {
    const player = this.context as THEOplayerInternal;
    player.removeEventListener(PlayerEventType.PLAY, this.onPlay);
    player.removeEventListener(PlayerEventType.PLAYING, this.onPlay);
    player.removeEventListener(PlayerEventType.PAUSE, this.onPause);
    player.removeEventListener(PlayerEventType.ERROR, this.onError);
    player.removeEventListener(PlayerEventType.SOURCE_CHANGE, this.onSourceChange);
  }

  private onPlay = () => {
    this.setState({ paused: false });
  };

  private onPause = () => {
    this.setState({ paused: true });
  };

  private onError = () => {
    this.setState({ error: true });
  };

  private onSourceChange = () => {
    this.setState({ error: false });
  };

  private togglePlayPause = () => {
    const player = this.context as THEOplayerInternal;
    if (player.paused) {
      player.play();
    } else {
      player.pause();
    }
  };

  render() {
    const { paused, error } = this.state;
    if (error) {
      return <></>;
    }
    return (
      <ActionButton
        touchable={!Platform.isTV}
        icon={paused ? PlayButton : null}
        style={styles.fullScreenCenter}
        iconStyle={styles.playButton}
        onPress={this.togglePlayPause}
      />
    );
  }
}

BigPlayButton.contextType = PlayerContext;
