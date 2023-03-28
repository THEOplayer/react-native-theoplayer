import React, { PureComponent } from 'react';
import { Platform } from 'react-native';
import { CastEvent, CastEventType, PlayerEventType } from 'react-native-theoplayer';
import { PlayerContext, UiContext } from '../util/PlayerContext';
import { isConnected } from './ChromecastButton';
import { ActionButton } from './actionbutton/ActionButton';
import { AirplaySvg } from './svg/AirplaySvg';

interface AirplayButtonState {
  connected: boolean;
}

export class AirplayButton extends PureComponent<unknown, AirplayButtonState> {
  private static initialState: AirplayButtonState = {
    connected: false,
  };

  constructor(props: unknown) {
    super(props);
    this.state = AirplayButton.initialState;
  }

  componentDidMount() {
    const player = (this.context as UiContext).player;
    player.addEventListener(PlayerEventType.CAST_EVENT, this.onCastStateChangeEvent);
    this.setState({ connected: player.cast.airplay?.casting === true });
  }

  componentWillUnmount() {
    const player = (this.context as UiContext).player;
    player.removeEventListener(PlayerEventType.CAST_EVENT, this.onCastStateChangeEvent);
  }

  private onCastStateChangeEvent = (event: CastEvent) => {
    if (event.subType != CastEventType.AIRPLAY_STATE_CHANGE) {
      return;
    }
    this.setState({ connected: isConnected(event.state) });
  };

  private onUIAirplayToggled = () => {
    const player = (this.context as UiContext).player;
    if (Platform.OS === 'ios' && !Platform.isTV) {
      if (isConnected(player.cast.airplay?.state)) {
        player.cast.airplay?.stop();
      } else {
        player.cast.airplay?.start();
      }
    }
  };

  render() {
    const { connected } = this.state;
    if (Platform.OS !== 'ios' || Platform.isTV) {
      return <></>;
    }
    return <ActionButton svg={<AirplaySvg />} touchable={true} onPress={this.onUIAirplayToggled} highlighted={connected} />;
  }
}

AirplayButton.contextType = PlayerContext;
