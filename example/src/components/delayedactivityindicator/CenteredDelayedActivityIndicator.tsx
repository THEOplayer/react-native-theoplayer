import React, { PureComponent } from 'react';
import type { DelayedActivityIndicatorProps } from './DelayedActivityIndicator';
import { DelayedActivityIndicator } from './DelayedActivityIndicator';
import { View } from 'react-native';
import { BufferingChangeEvent, PlayerEventType, THEOplayerInternal } from 'react-native-theoplayer';
import { PlayerContext } from '../util/Context';
import { PlayerStyleContext, VideoPlayerStyle } from '../style/VideoPlayerStyle';

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
    const player = this.context as THEOplayerInternal;
    player.addEventListener(PlayerEventType.BUFFERING_CHANGE, this.onBufferingStateChange);
  }

  componentWillUnmount() {
    const player = this.context as THEOplayerInternal;
    player.removeEventListener(PlayerEventType.BUFFERING_CHANGE, this.onBufferingStateChange);
  }

  private onBufferingStateChange = (event: BufferingChangeEvent) => {
    this.setState({ showing: event.isBuffering });
  };

  render() {
    const { delay } = this.props;
    const { showing } = this.state;
    const player = this.context;
    return (
      showing &&
      !player.paused && (
        <PlayerStyleContext.Consumer>
          {(styleContext: VideoPlayerStyle) => (
            <View style={styleContext.fullScreenCenter}>
              <DelayedActivityIndicator size="large" color="#ffc50f" delay={delay} />
            </View>
          )}
        </PlayerStyleContext.Consumer>
      )
    );
  }
}

CenteredDelayedActivityIndicator.contextType = PlayerContext;
