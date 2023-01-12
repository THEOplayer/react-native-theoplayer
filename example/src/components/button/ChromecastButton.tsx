import React, { PureComponent } from 'react';
import { CastButton as GoogleCastButton } from 'react-native-google-cast';
import type { CastEvent, THEOplayerInternal } from 'react-native-theoplayer';
import { CastEventType, PlayerEventType } from 'react-native-theoplayer';
import { ENABLE_CAST_BUTTON } from '../videoplayer/VideoPlayerUIProps';
import { PlayerContext } from '../util/Context';
import { Platform } from 'react-native';
import { PlayerStyleContext, VideoPlayerStyle } from '../style/VideoPlayerStyle';

interface ChromecastButtonState {
  connected: boolean;
}

export class ChromecastButton extends PureComponent<unknown, ChromecastButtonState> {
  private static initialState: ChromecastButtonState = {
    connected: false,
  };

  constructor(props: unknown) {
    super(props);
    this.state = ChromecastButton.initialState;
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
    if (event.subType != CastEventType.CHROMECAST_STATE_CHANGE) {
      return;
    }
    this.setState({
      connected: event.state === 'connecting' || event.state === 'connected',
    });
  };

  render() {
    const { connected } = this.state;
    if (!ENABLE_CAST_BUTTON || Platform.isTV) {
      return <></>;
    }
    return (
      <PlayerStyleContext.Consumer>
        {(styleContext: VideoPlayerStyle) => (
          <GoogleCastButton style={styleContext.controlBar.castButton} tintColor={connected ? '#ffc50f' : 'white'} />
        )}
      </PlayerStyleContext.Consumer>
    );
  }
}

ChromecastButton.contextType = PlayerContext;
