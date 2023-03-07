import React, { PureComponent } from 'react';
import { CastEvent, CastEventType, ErrorEvent, PlayerError, PlayerEventType } from 'react-native-theoplayer';
import { Text, View } from 'react-native';
import { PlayerContext, UiContext } from '../util/PlayerContext';

interface ErrorDisplayState {
  error: PlayerError | undefined;
}

export class ErrorDisplay extends PureComponent<unknown, ErrorDisplayState> {
  constructor(props: unknown) {
    super(props);
    this.state = { error: undefined };
  }

  componentDidMount() {
    const player = (this.context as UiContext).player;
    player.addEventListener(PlayerEventType.LOAD_START, this.onLoadStart);
    player.addEventListener(PlayerEventType.ERROR, this.onError);
    player.addEventListener(PlayerEventType.CAST_EVENT, this.onCastEvent);
  }

  componentWillUnmount() {
    const player = (this.context as UiContext).player;
    player.removeEventListener(PlayerEventType.LOAD_START, this.onLoadStart);
    player.removeEventListener(PlayerEventType.ERROR, this.onError);
    player.removeEventListener(PlayerEventType.CAST_EVENT, this.onCastEvent);
  }

  private onLoadStart = () => {
    this.setState({ error: undefined });
  };

  private onError = (event: ErrorEvent) => {
    const { error } = event;
    this.setState({ error });
  };

  private onCastEvent = (event: CastEvent) => {
    if (event.subType === CastEventType.CHROMECAST_ERROR)
      this.setState({
        error: {
          errorCode: event.error.errorCode,
          errorMessage: event.error.description,
        },
      });
  };

  render() {
    const { error } = this.state;

    if (!error) {
      return <></>;
    }

    return (
      <PlayerContext.Consumer>
        {(context: UiContext) => (
          <View style={context.style.fullScreenCenter}>
            <Text style={[context.style.text, { color: context.style.colors.text, backgroundColor: context.style.colors.secondary }]}>
              {error.errorCode} - {error.errorMessage}
            </Text>
          </View>
        )}
      </PlayerContext.Consumer>
    );
  }
}

ErrorDisplay.contextType = PlayerContext;
