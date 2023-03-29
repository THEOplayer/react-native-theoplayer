import React, { PureComponent } from 'react';
import type { PresentationMode, PresentationModeChangeEvent } from 'react-native-theoplayer';
import { PlayerEventType } from 'react-native-theoplayer';
import { Platform } from 'react-native';
import { ActionButton } from './actionbutton/ActionButton';
import { PlayerContext, UiContext } from '../util/PlayerContext';
import { PipExitSvg } from './svg/PipExitSvg';
import { PipEnterSvg } from './svg/PipEnterSvg';

interface PipButtonState {
  presentationMode: PresentationMode;
}

export class PipButton extends PureComponent<unknown, PipButtonState> {
  constructor(props: unknown) {
    super(props);
    this.state = { presentationMode: 'inline' };
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

  private togglePip = () => {
    const player = (this.context as UiContext).player;
    switch (player.presentationMode) {
      case 'inline':
      case 'fullscreen':
        player.presentationMode = 'picture-in-picture';
        break;
      case 'picture-in-picture':
        player.presentationMode = 'inline';
        break;
    }
  };

  render() {
    if (Platform.isTV) {
      return <></>;
    }
    const { presentationMode } = this.state;

    return <ActionButton svg={presentationMode === 'picture-in-picture' ? <PipExitSvg /> : <PipEnterSvg />} onPress={this.togglePip} />;
  }
}

PipButton.contextType = PlayerContext;
