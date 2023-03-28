import React, { PureComponent } from 'react';
import { CastButton } from 'react-native-google-cast';
import type { CastEvent } from 'react-native-theoplayer';
import { CastEventType, PlayerEventType } from 'react-native-theoplayer';
import { PlayerContext, UiContext } from '../util/PlayerContext';
import { isConnected } from './ChromecastButton';

interface ChromecastButtonState {
  connected: boolean;
}

// NOTE: react-native-google-cast does not support web yet.
export class GoogleCastButton extends PureComponent<unknown, ChromecastButtonState> {
  private static initialState: ChromecastButtonState = {
    connected: false,
  };

  constructor(props: unknown) {
    super(props);
    this.state = GoogleCastButton.initialState;
  }

  componentDidMount() {
    const player = (this.context as UiContext).player;
    player.addEventListener(PlayerEventType.CAST_EVENT, this.onCastStateChangeEvent);
    this.setState({ connected: player.cast?.casting });
  }

  componentWillUnmount() {
    const player = (this.context as UiContext).player;
    player.removeEventListener(PlayerEventType.CAST_EVENT, this.onCastStateChangeEvent);
  }

  private onCastStateChangeEvent = (event: CastEvent) => {
    if (event.subType != CastEventType.CHROMECAST_STATE_CHANGE) {
      return;
    }
    this.setState({ connected: isConnected(event.state) });
  };

  render() {
    const { connected } = this.state;
    return (
      <PlayerContext.Consumer>
        {(context: UiContext) => (
          <CastButton
            style={context.style.controlBar.buttonIcon}
            tintColor={connected ? context.style.colors.accent : context.style.colors.primary}
          />
        )}
      </PlayerContext.Consumer>
    );
  }
}

GoogleCastButton.contextType = PlayerContext;
