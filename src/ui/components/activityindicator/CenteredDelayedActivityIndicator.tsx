import React, { PureComponent } from 'react';
import type { DelayedActivityIndicatorProps } from './DelayedActivityIndicator';
import { DelayedActivityIndicator } from './DelayedActivityIndicator';
import { View } from 'react-native';
import { ErrorEvent, PlayerError, PlayerEventType, ReadyStateChangeEvent } from 'react-native-theoplayer';
import { PlayerContext, UiContext } from '../util/PlayerContext';
import { FULLSCREEN_CENTER_STYLE } from '../uicontroller/UiContainer';

interface CenteredDelayedActivityIndicatorState {
  showLoadingIndicator: boolean;
  error: PlayerError | undefined;
}

/**
 * The default spinner for the `react-native-theoplayer` UI. It renders a ActivityIndicator when the player's playback is stalling due
 * readystate changes.
 */
export class CenteredDelayedActivityIndicator extends PureComponent<DelayedActivityIndicatorProps, CenteredDelayedActivityIndicatorState> {
  private static initialState: CenteredDelayedActivityIndicatorState = {
    showLoadingIndicator: false,
    error: undefined,
  };

  constructor(props: DelayedActivityIndicatorProps) {
    super(props);
    this.state = CenteredDelayedActivityIndicator.initialState;
  }

  componentDidMount() {
    const player = (this.context as UiContext).player;
    player.addEventListener(PlayerEventType.READYSTATE_CHANGE, this.onReadyStateChange);
    player.addEventListener(PlayerEventType.ERROR, this.onError);
    player.addEventListener(PlayerEventType.PLAYING, this.onPlaying);
    player.addEventListener(PlayerEventType.SOURCE_CHANGE, this.onSourceChange);
    player.addEventListener(PlayerEventType.LOAD_START, this.onLoadStart);
  }

  componentWillUnmount() {
    const player = (this.context as UiContext).player;
    player.removeEventListener(PlayerEventType.READYSTATE_CHANGE, this.onReadyStateChange);
    player.removeEventListener(PlayerEventType.ERROR, this.onError);
    player.removeEventListener(PlayerEventType.PLAYING, this.onPlaying);
    player.removeEventListener(PlayerEventType.SOURCE_CHANGE, this.onSourceChange);
    player.removeEventListener(PlayerEventType.LOAD_START, this.onLoadStart);
  }

  private onReadyStateChange = (event: ReadyStateChangeEvent) => {
    this.maybeShowLoadingIndicator(event.readyState < 3);
  };

  private onError = (event: ErrorEvent) => {
    const { error } = event;
    this.setState({ error });
    this.maybeShowLoadingIndicator(false);
  };

  private onPlaying = () => {
    this.maybeShowLoadingIndicator(false);
  };

  private onSourceChange = () => {
    this.setState({ error: undefined });
    this.maybeShowLoadingIndicator(false);
  };

  private onLoadStart = () => {
    this.setState({ error: undefined });
    this.maybeShowLoadingIndicator(true);
  };

  private maybeShowLoadingIndicator(showLoading: boolean) {
    const { error } = this.state;
    // do not change state to buffering in case of an error or if the player is paused
    const player = (this.context as UiContext).player;
    this.setState({ showLoadingIndicator: showLoading && !error && !player.paused });
  }

  render() {
    const { showLoadingIndicator } = this.state;
    const player = (this.context as UiContext).player;
    return (
      showLoadingIndicator &&
      !player.paused && (
        <PlayerContext.Consumer>
          {(context: UiContext) => (
            <View style={FULLSCREEN_CENTER_STYLE}>
              <DelayedActivityIndicator color={context.style.colors.icon} {...this.props} />
            </View>
          )}
        </PlayerContext.Consumer>
      )
    );
  }
}

CenteredDelayedActivityIndicator.contextType = PlayerContext;
