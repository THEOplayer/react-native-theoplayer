import React, { PureComponent } from 'react';
import 'react-native/tvos-types.d';
import { StyleProp, StyleSheet, ViewStyle } from 'react-native';
import { DurationChangeEvent, LoadedMetadataEvent, PlayerEventType, ProgressEvent, TimeRange, TimeUpdateEvent } from 'react-native-theoplayer';
import { PlayerContext, UiContext } from '../util/PlayerContext';
import Slider from '@react-native-community/slider';
import type { ThumbnailMode } from './ThumbnailRendering';

export interface SeekBarProps {
  /**
   * Optional style applied to the SeekBar.
   */
  style?: StyleProp<ViewStyle>;

  /**
   * Thumbnail view mode.
   */
  thumbnailMode?: ThumbnailMode;
}

interface SeekBarState {
  isScrubbing: boolean;
  pausedDueToScrubbing: boolean;
  seekable: TimeRange[];
  duration: number;
  currentTime: number;
}

export class SeekBar extends PureComponent<SeekBarProps, SeekBarState> {
  private static initialState: SeekBarState = {
    isScrubbing: false,
    currentTime: 0,
    duration: 0,
    seekable: [],
    pausedDueToScrubbing: false,
  };

  private _seekBlockingTimeout: NodeJS.Timeout | undefined;

  constructor(props: SeekBarProps) {
    super(props);
    this.state = SeekBar.initialState;
  }

  componentDidMount() {
    const player = (this.context as UiContext).player;
    player.addEventListener(PlayerEventType.LOADED_METADATA, this._onLoadedMetadata);
    player.addEventListener(PlayerEventType.DURATION_CHANGE, this._onDurationChange);
    player.addEventListener(PlayerEventType.TIME_UPDATE, this._onTimeUpdate);
    player.addEventListener(PlayerEventType.PROGRESS, this._onProgress);
    this.setState({
      ...SeekBar.initialState,
      currentTime: player.currentTime,
      duration: player.duration,
      seekable: player.seekable,
    });
  }

  componentWillUnmount() {
    const context = this.context as UiContext;
    context.player.removeEventListener(PlayerEventType.LOADED_METADATA, this._onLoadedMetadata);
    context.player.removeEventListener(PlayerEventType.DURATION_CHANGE, this._onDurationChange);
    context.player.removeEventListener(PlayerEventType.TIME_UPDATE, this._onTimeUpdate);
    context.player.removeEventListener(PlayerEventType.PROGRESS, this._onProgress);
  }

  private _onTimeUpdate = (event: TimeUpdateEvent) => this.setState({ currentTime: event.currentTime });
  private _onLoadedMetadata = (event: LoadedMetadataEvent) => this.setState({ duration: event.duration });
  private _onDurationChange = (event: DurationChangeEvent) => this.setState({ duration: event.duration });
  private _onProgress = (event: ProgressEvent) => this.setState({ seekable: event.seekable });

  private _onSlidingStart = (value: number) => {
    const player = (this.context as UiContext).player;
    if (!player.paused) {
      player.pause();
      this.setState({ pausedDueToScrubbing: true });
    }
    this.setState({ currentTime: value, isScrubbing: true });
    this.debounceSeek();
  };

  private _onValueChange = (value: number) => {
    this.setState({ currentTime: value });
    if (this.state.isScrubbing) {
      this.debounceSeek();
    }
  };

  private _onSlidingComplete = (value: number) => {
    clearTimeout(this._seekBlockingTimeout);
    this._seekBlockingTimeout = undefined;
    const player = (this.context as UiContext).player;
    player.currentTime = value;
    this.setState({ isScrubbing: false });
    if (this.state.pausedDueToScrubbing) {
      player.play();
      this.setState({ pausedDueToScrubbing: false });
    }
  };

  private debounceSeek = () => {
    // Don't bombard the player with seeks when seeking. Allow only one seek ever X milliseconds:
    const MAX_SEEK_INTERVAL = 200;
    if (this._seekBlockingTimeout === undefined) {
      const { currentTime } = this.state;
      const player = (this.context as UiContext).player;
      player.currentTime = currentTime;
      const allowSeeks = () => {
        this._seekBlockingTimeout = undefined;
      };
      this._seekBlockingTimeout = setTimeout(allowSeeks, MAX_SEEK_INTERVAL);
    }
  };

  render() {
    const { seekable, currentTime, duration } = this.state;
    const { style } = this.props;
    const seekableStart = seekable.length > 0 ? seekable[0].start : 0;
    const seekableEnd = seekable.length > 0 ? seekable[seekable.length - 1].end : 0; // TODO what if it's fragmented?
    return (
      <PlayerContext.Consumer>
        {(context: UiContext) => (
          <Slider
            disabled={!(duration > 0) && seekable.length > 0}
            style={[StyleSheet.absoluteFill, style]}
            minimumValue={seekableStart}
            maximumValue={seekableEnd}
            step={1000}
            onSlidingStart={this._onSlidingStart}
            onValueChange={this._onValueChange}
            onSlidingComplete={this._onSlidingComplete}
            value={currentTime}
            focusable={true}
            minimumTrackTintColor={context.style.colors.primary}
            maximumTrackTintColor="#000000"
            thumbTintColor={context.style.colors.primary}
          />
        )}
      </PlayerContext.Consumer>
    );
  }
}

SeekBar.contextType = PlayerContext;
