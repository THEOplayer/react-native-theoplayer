import { MutedIcon, UnMutedIcon } from '../../res/images';
import { ActionButton } from './actionbutton/ActionButton';
import React, { PureComponent } from 'react';
import { PlayerContext } from '../util/Context';
import { PlayerEventType, THEOplayerInternal, VolumeChangeEvent } from 'react-native-theoplayer';
import { Platform } from 'react-native';
import { controlBarStyle } from '../controlbar/ControlBar';

interface MuteButtonState {
  muted: boolean;
}

export class MuteButton extends PureComponent<unknown, MuteButtonState> {
  constructor(props: unknown) {
    super(props);
    this.state = { muted: false };
  }

  componentDidMount() {
    const player = this.context as THEOplayerInternal;
    player.addEventListener(PlayerEventType.VOLUME_CHANGE, this.onVolumeChange);
  }

  componentWillUnmount() {
    const player = this.context as THEOplayerInternal;
    player.removeEventListener(PlayerEventType.VOLUME_CHANGE, this.onVolumeChange);
  }

  private onVolumeChange = (_: VolumeChangeEvent) => {
    const player = this.context as THEOplayerInternal;
    this.setState({ muted: player.muted });
  };

  private toggleMuted = () => {
    const player = this.context as THEOplayerInternal;
    player.muted = !player.muted;
  };

  render() {
    const { muted } = this.state;
    if (Platform.isTV) {
      return <></>;
    }
    return <ActionButton icon={muted ? MutedIcon : UnMutedIcon} onPress={this.toggleMuted} iconStyle={controlBarStyle.menuIcon} touchable={true} />;
  }
}

MuteButton.contextType = PlayerContext;
