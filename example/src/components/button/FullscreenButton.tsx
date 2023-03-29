import React, { PureComponent } from 'react';
import type { PresentationModeChangeEvent } from 'react-native-theoplayer';
import { PlayerEventType, PresentationMode } from 'react-native-theoplayer';
import { Platform } from 'react-native';
import { ActionButton } from './actionbutton/ActionButton';
import { PlayerContext, UiContext } from '../util/PlayerContext';
import { FullscreenExitSvg } from './svg/FullscreenExitSvg';
import { FullscreenEnterSvg } from './svg/FullscreenEnterSvg';

interface FullscreenButtonState {
  presentationMode: PresentationMode;
}

export class FullscreenButton extends PureComponent<unknown, FullscreenButtonState> {
  constructor(props: unknown) {
    super(props);
    this.state = { presentationMode: PresentationMode.inline };
  }

  componentDidMount() {
    const player = (this.context as UiContext).player;
    player.addEventListener(PlayerEventType.PRESENTATIONMODE_CHANGE, this.onPresentationModeChange);
    this.setState({ presentationMode: player.presentationMode });
  }

  componentWillUnmount() {
    const player = (this.context as UiContext).player;
    player.removeEventListener(PlayerEventType.PRESENTATIONMODE_CHANGE, this.onPresentationModeChange);
  }

  private readonly onPresentationModeChange = (event: PresentationModeChangeEvent) => {
    this.setState({ presentationMode: event.presentationMode });
  };

  private toggleFullScreen = () => {
    const player = (this.context as UiContext).player;
    switch (player.presentationMode) {
      case 'picture-in-picture':
      case 'inline':
        player.presentationMode = PresentationMode.fullscreen;
        break;
      case 'fullscreen':
        player.presentationMode = PresentationMode.inline;
        break;
    }
  };

  render() {
    const { presentationMode } = this.state;
    if (Platform.isTV) {
      return <></>;
    }
    return <ActionButton svg={presentationMode === 'fullscreen' ? <FullscreenExitSvg /> : <FullscreenEnterSvg />} onPress={this.toggleFullScreen} />;
  }
}

FullscreenButton.contextType = PlayerContext;
