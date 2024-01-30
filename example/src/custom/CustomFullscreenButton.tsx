import React, { PureComponent } from 'react';
import { PresentationMode } from 'react-native-theoplayer';
import { Platform } from 'react-native';
import { ActionButton, FullscreenEnterSvg, FullscreenExitSvg } from '@theoplayer/react-native-ui';


interface FullscreenButtonState {
  presentationMode: PresentationMode;
}
interface FullscreenButtonProps {
  onToggle: (fullscreen: boolean) => void;
}
/**
 * The button to enable/disable fullscreen for the `react-native-theoplayer` UI.
 *
 * NOTE: this is a temporary implementation, until the iOS bridge does not trigger native fullscreen.
 */
export class CustomFullscreenButton extends PureComponent<FullscreenButtonProps, FullscreenButtonState> {
  constructor(props: FullscreenButtonProps) {
    super(props);
    this.state = { presentationMode: PresentationMode.inline };
  }

  private toggleFullScreen = () => {
    const toFullscreen = this.state.presentationMode !== PresentationMode.fullscreen;
    const newPresentationMode = toFullscreen ? PresentationMode.fullscreen : PresentationMode.inline;
    this.setState({ presentationMode: newPresentationMode });
    this.props.onToggle(toFullscreen);
  };

  render() {
    const { presentationMode } = this.state;
    if (Platform.isTV) {
      return <></>;
    }
    return <ActionButton svg={presentationMode === 'fullscreen' ? <FullscreenExitSvg /> : <FullscreenEnterSvg />} onPress={this.toggleFullScreen} touchable/>;
  }
}
