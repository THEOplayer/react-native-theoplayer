import React, { PureComponent } from 'react';
import { Image, Platform, TouchableOpacity } from 'react-native';
import { AirplayIcon } from '../../res/images';
import { CastEvent, CastEventType, PlayerEventType } from 'react-native-theoplayer';
import { PlayerContext, UiContext } from '../util/PlayerContext';

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
    player.cast.airplay?.casting().then((casting) => this.setState({ connected: casting }));
  }

  componentWillUnmount() {
    const player = (this.context as UiContext).player;
    player.removeEventListener(PlayerEventType.CAST_EVENT, this.onCastStateChangeEvent);
  }

  private onCastStateChangeEvent = (event: CastEvent) => {
    if (event.subType != CastEventType.AIRPLAY_STATE_CHANGE) {
      return;
    }
    this.setState({
      connected: event.state === 'connecting' || event.state === 'connected',
    });
  };

  private onUIAirplayToggled = () => {
    const player = (this.context as UiContext).player;
    if (Platform.OS === 'ios' && !Platform.isTV) {
      player.cast.airplay?.state().then((airplayCastState) => {
        const inConnection = airplayCastState === 'connected' || airplayCastState === 'connecting';
        if (inConnection) {
          player.cast.airplay?.stop();
        } else {
          player.cast.airplay?.start();
        }
      });
    }
  };

  render() {
    const { connected } = this.state;
    if (Platform.OS !== 'ios' || Platform.isTV) {
      return <></>;
    }
    return (
      <PlayerContext.Consumer>
        {(context: UiContext) => (
          <TouchableOpacity style={context.style.controlBar.buttonIcon} onPress={this.onUIAirplayToggled}>
            <Image
              style={[context.style.controlBar.buttonIcon, { tintColor: connected ? context.style.colors.accent : context.style.colors.primary }]}
              source={AirplayIcon}
            />
          </TouchableOpacity>
        )}
      </PlayerContext.Consumer>
    );
  }
}

AirplayButton.contextType = PlayerContext;
