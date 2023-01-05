import React, { PureComponent, useContext } from 'react';
import { Image, Platform, TouchableOpacity } from 'react-native';
import { AirplayIcon } from '../../res/images';
import { CastEvent, CastEventType, PlayerEventType, THEOplayerInternal } from 'react-native-theoplayer';
import { PlayerContext } from '../util/Context';
import { controlBarStyle } from '../controlbar/ControlBar';

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
    const player = this.context as THEOplayerInternal;
    player.addEventListener(PlayerEventType.CAST_EVENT, this.onCastStateChangeEvent);
  }

  componentWillUnmount() {
    const player = this.context as THEOplayerInternal;
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
    const player = useContext(PlayerContext);
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
      <TouchableOpacity style={controlBarStyle.castButton} onPress={this.onUIAirplayToggled}>
        <Image style={[controlBarStyle.castIcon, { tintColor: connected ? '#ffc50f' : 'white' }]} source={AirplayIcon} />
      </TouchableOpacity>
    );
  }
}

AirplayButton.contextType = PlayerContext;
