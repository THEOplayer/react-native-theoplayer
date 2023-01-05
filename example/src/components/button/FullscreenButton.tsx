import React, { PureComponent } from 'react';
import type { FullscreenEvent, THEOplayerInternal } from 'react-native-theoplayer';
import { FullscreenActionType, PlayerEventType } from 'react-native-theoplayer';
import { Platform } from 'react-native';
import { FullScreenExitIcon, FullScreenIcon } from '../../res/images';
import { ActionButton } from './actionbutton/ActionButton';
import { PlayerContext } from '../util/Context';
import { controlBarStyle } from '../controlbar/ControlBar';

interface FullscreenButtonState {
  fullscreen: boolean;
}

export class FullscreenButton extends PureComponent<unknown, FullscreenButtonState> {
  constructor(props: unknown) {
    super(props);
    this.state = { fullscreen: false };
  }

  componentDidMount() {
    const player = this.context as THEOplayerInternal;
    player.addEventListener(PlayerEventType.FULLSCREEN, this.onFullscreenEvent);
  }

  componentWillUnmount() {
    const player = this.context as THEOplayerInternal;
    player.removeEventListener(PlayerEventType.FULLSCREEN, this.onFullscreenEvent);
  }

  private readonly onFullscreenEvent = (event: FullscreenEvent) => {
    switch (event.fullscreenAction) {
      case FullscreenActionType.PLAYER_WILL_PRESENT:
        this.setState({ fullscreen: true });
        break;
      case FullscreenActionType.PLAYER_WILL_DISMISS:
        this.setState({ fullscreen: false });
        break;
    }
  };

  private toggleFullScreen = () => {
    const player = this.context as THEOplayerInternal;
    player.fullscreen = !player.fullscreen;
  };

  render() {
    const { fullscreen } = this.state;
    if (Platform.isTV) {
      return <></>;
    }
    return (
      <ActionButton icon={fullscreen ? FullScreenExitIcon : FullScreenIcon} onPress={this.toggleFullScreen} iconStyle={controlBarStyle.menuIcon} />
    );
  }
}

FullscreenButton.contextType = PlayerContext;
