import { ActionButton } from './actionbutton/ActionButton';
import React, { PureComponent } from 'react';
import { PlayerContext, UiContext } from '../util/PlayerContext';
import { PlayerEventType, VolumeChangeEvent } from 'react-native-theoplayer';
import { Platform } from 'react-native';
import { VolumeOffSvg } from './svg/VolumeOffSvg';
import { VolumeUpSvg } from './svg/VolumeUpSvg';

interface MuteButtonState {
  muted: boolean;
}

/**
 * The default mute button for the `react-native-theoplayer` UI.
 */
export class MuteButton extends PureComponent<unknown, MuteButtonState> {
  constructor(props: unknown) {
    super(props);
    this.state = { muted: false };
  }

  componentDidMount() {
    const player = (this.context as UiContext).player;
    player.addEventListener(PlayerEventType.VOLUME_CHANGE, this.onVolumeChange);
    this.setState({ muted: player.muted });
  }

  componentWillUnmount() {
    const player = (this.context as UiContext).player;
    player.removeEventListener(PlayerEventType.VOLUME_CHANGE, this.onVolumeChange);
  }

  private onVolumeChange = (_: VolumeChangeEvent) => {
    const player = (this.context as UiContext).player;
    this.setState({ muted: player.muted });
  };

  private toggleMuted = () => {
    const player = (this.context as UiContext).player;
    player.muted = !player.muted;
  };

  render() {
    const { muted } = this.state;
    if (Platform.isTV) {
      return <></>;
    }
    return <ActionButton svg={muted ? <VolumeOffSvg /> : <VolumeUpSvg />} onPress={this.toggleMuted} touchable={true} />;
  }
}

MuteButton.contextType = PlayerContext;
