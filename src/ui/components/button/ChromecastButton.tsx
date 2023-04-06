import React, { PureComponent } from 'react';
import { CastButton } from 'react-native-google-cast';
import type { CastEvent } from 'react-native-theoplayer';
import { CastEventType, CastState, PlayerEventType } from 'react-native-theoplayer';
import { PlayerContext, UiContext } from '../util/PlayerContext';
import { DEFAULT_ACTION_BUTTON_STYLE } from './actionbutton/ActionButton';

interface CastButtonState {
  connected: boolean;
}

export function isConnected(state: CastState | undefined): boolean {
  return state === 'connecting' || state === 'connected';
}

/**
 * The native button to enable Chromecast for the `react-native-theoplayer` UI.
 * This component uses the button from `react-native-google-cast` and is not supported on web.
 */
export class ChromecastButton extends PureComponent<unknown, CastButtonState> {
  private static initialState: CastButtonState = {
    connected: false,
  };

  constructor(props: unknown) {
    super(props);
    this.state = ChromecastButton.initialState;
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
          <CastButton style={DEFAULT_ACTION_BUTTON_STYLE} tintColor={connected ? context.style.colors.iconSelected : context.style.colors.icon} />
        )}
      </PlayerContext.Consumer>
    );
  }
}

ChromecastButton.contextType = PlayerContext;
