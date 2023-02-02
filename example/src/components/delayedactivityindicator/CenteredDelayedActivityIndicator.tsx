import React, { PureComponent } from 'react';
import type { DelayedActivityIndicatorProps } from './DelayedActivityIndicator';
import { DelayedActivityIndicator } from './DelayedActivityIndicator';
import { View } from 'react-native';
import { BufferingChangeEvent, PlayerEventType, THEOplayer } from 'react-native-theoplayer';
import { PlayerContext, PlayerWithStyle } from '../util/PlayerContext';

interface CenteredDelayedActivityIndicatorState {
  showing: boolean;
}

export class CenteredDelayedActivityIndicator extends PureComponent<DelayedActivityIndicatorProps, CenteredDelayedActivityIndicatorState> {
  private static initialState: CenteredDelayedActivityIndicatorState = {
    showing: false,
  };

  constructor(props: DelayedActivityIndicatorProps) {
    super(props);
    this.state = CenteredDelayedActivityIndicator.initialState;
  }

  componentDidMount() {
    const player = this.context.player as THEOplayer;
    player.addEventListener(PlayerEventType.BUFFERING_CHANGE, this.onBufferingStateChange);
  }

  componentWillUnmount() {
    const player = this.context.player as THEOplayer;
    player.removeEventListener(PlayerEventType.BUFFERING_CHANGE, this.onBufferingStateChange);
  }

  private onBufferingStateChange = (event: BufferingChangeEvent) => {
    this.setState({ showing: event.isBuffering });
  };

  render() {
    const { delay } = this.props;
    const { showing } = this.state;
    const player = this.context.player as THEOplayer;
    return (
      showing &&
      !player.paused && (
        <PlayerContext.Consumer>
          {(context: PlayerWithStyle) => (
            <View style={context.style.videoPlayer.fullScreenCenter}>
              <DelayedActivityIndicator size="large" color="#ffc50f" delay={delay} />
            </View>
          )}
        </PlayerContext.Consumer>
      )
    );
  }
}

CenteredDelayedActivityIndicator.contextType = PlayerContext;
