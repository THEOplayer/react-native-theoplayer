import React, { PureComponent } from 'react';
import { CastEvent, CastEventType, PlayerEventType } from 'react-native-theoplayer';
import { Text } from 'react-native';
import { PlayerContext, UiContext } from '../util/PlayerContext';

interface CastMessageState {
  message: string | undefined;
}

export class CastMessage extends PureComponent<unknown, CastMessageState> {
  constructor(props: unknown) {
    super(props);
    this.state = { message: undefined };
  }

  componentDidMount() {
    const player = (this.context as UiContext).player;
    player.addEventListener(PlayerEventType.CAST_EVENT, this.onCastEvent);
  }

  componentWillUnmount() {
    const player = (this.context as UiContext).player;
    player.removeEventListener(PlayerEventType.CAST_EVENT, this.onCastEvent);
  }

  private onCastEvent = (event: CastEvent) => {
    if (event.subType !== CastEventType.CHROMECAST_STATE_CHANGE && event.subType !== CastEventType.AIRPLAY_STATE_CHANGE) {
      return;
    }
    const stateEvent = event;
    let message = undefined;
    const castTarget = event.subType === CastEventType.CHROMECAST_STATE_CHANGE ? 'chromecast' : 'airplay';
    switch (stateEvent.state) {
      case 'connecting':
        message = `Connecting to ${castTarget} ...`;
        break;
      case 'connected':
        message = `Playing on ${castTarget}`;
        break;
    }
    this.setState({
      message,
    });
  };

  render() {
    const { message } = this.state;

    if (!message) {
      return <></>;
    }

    return (
      <PlayerContext.Consumer>
        {(context: UiContext) => (
          <Text style={[context.style.videoPlayer.message, { color: context.style.colors.text, backgroundColor: context.style.colors.secondary }]}>
            {message}
          </Text>
        )}
      </PlayerContext.Consumer>
    );
  }
}

CastMessage.contextType = PlayerContext;
