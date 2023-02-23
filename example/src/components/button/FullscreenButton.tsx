import React, { PureComponent } from 'react';
import type { FullscreenEvent } from 'react-native-theoplayer';
import { FullscreenActionType, PlayerEventType } from 'react-native-theoplayer';
import { Platform } from 'react-native';
import { ActionButton } from './actionbutton/ActionButton';
import { PlayerContext, UiContext } from '../util/PlayerContext';
import { FullscreenExitSvg } from './svg/FullscreenExitSvg';
import { FullscreenEnterSvg } from './svg/FullscreenEnterSvg';

interface FullscreenButtonState {
  fullscreen: boolean;
}

export class FullscreenButton extends PureComponent<unknown, FullscreenButtonState> {
  constructor(props: unknown) {
    super(props);
    this.state = { fullscreen: false };
  }

  componentDidMount() {
    const player = (this.context as UiContext).player;
    player.addEventListener(PlayerEventType.FULLSCREEN, this.onFullscreenEvent);
  }

  componentWillUnmount() {
    const player = (this.context as UiContext).player;
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
    const player = (this.context as UiContext).player;
    player.fullscreen = !player.fullscreen;
  };

  render() {
    const { fullscreen } = this.state;
    if (Platform.isTV) {
      return <></>;
    }
    return (
      <PlayerContext.Consumer>
        {(context: UiContext) => (
          <ActionButton
            svg={fullscreen ? <FullscreenExitSvg /> : <FullscreenEnterSvg />}
            onPress={this.toggleFullScreen}
            iconStyle={context.style.controlBar.buttonIcon}
          />
        )}
      </PlayerContext.Consumer>
    );
  }
}

FullscreenButton.contextType = PlayerContext;
