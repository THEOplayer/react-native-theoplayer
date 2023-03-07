import React, { PureComponent } from 'react';
import { CastButton as GoogleCastButton } from 'react-native-google-cast';
import type { CastEvent } from 'react-native-theoplayer';
import { CastEventType, PlayerEventType } from 'react-native-theoplayer';
import { PlayerContext, UiContext } from '../util/PlayerContext';
import { Platform } from 'react-native';

// whether to show a cast button.
// NOTE: react-native-google-cast does not support web yet.
// TODO: create own cast button for web.
export const ENABLE_CAST_BUTTON = Platform.OS !== 'web' && !Platform.isTV;

interface ChromecastButtonState {
  connected: boolean;
}

export class ChromecastButton extends PureComponent<unknown, ChromecastButtonState> {
  private static initialState: ChromecastButtonState = {
    connected: false,
  };

  constructor(props: unknown) {
    super(props);
    this.state = ChromecastButton.initialState;
  }

  componentDidMount() {
    const player = (this.context as UiContext).player;
    player.addEventListener(PlayerEventType.CAST_EVENT, this.onCastStateChangeEvent);
    player.cast.chromecast?.casting().then((casting) => this.setState({ connected: casting }));
  }

  componentWillUnmount() {
    const player = (this.context as UiContext).player;
    player.removeEventListener(PlayerEventType.CAST_EVENT, this.onCastStateChangeEvent);
  }

  private onCastStateChangeEvent = (event: CastEvent) => {
    if (event.subType != CastEventType.CHROMECAST_STATE_CHANGE) {
      return;
    }
    this.setState({
      connected: event.state === 'connecting' || event.state === 'connected',
    });
  };

  render() {
    const { connected } = this.state;
    if (!ENABLE_CAST_BUTTON) {
      return <></>;
    }
    return (
      <PlayerContext.Consumer>
        {(context: UiContext) => (
          <GoogleCastButton
            style={context.style.controlBar.buttonIcon}
            tintColor={connected ? context.style.colors.accent : context.style.colors.primary}
          />
        )}
      </PlayerContext.Consumer>
    );
  }
}

ChromecastButton.contextType = PlayerContext;
