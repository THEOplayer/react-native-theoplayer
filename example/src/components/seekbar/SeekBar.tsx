import React, { PureComponent } from 'react';
import 'react-native/tvos-types.d';
import { LayoutChangeEvent, StyleProp, StyleSheet, View, ViewStyle } from 'react-native';
import { DurationChangeEvent, LoadedMetadataEvent, PlayerEventType, ProgressEvent, TimeRange, TimeUpdateEvent } from 'react-native-theoplayer';
import { PlayerContext, UiContext } from '../util/PlayerContext';
import Slider from '@react-native-community/slider';
import { SingleThumbnailView } from './thumbnail/SingleThumbnailView';

export interface SeekBarProps {
  /**
   * Optional style applied to the SeekBar.
   */
  style?: StyleProp<ViewStyle>;
}

interface SeekBarState {
  ignoreTimeupdate: boolean;
  isSeeking: boolean;
  pausedDueToScrubbing: boolean;
  seekable: TimeRange[];
  duration: number;
  sliderTime: number;
  width: number;
}

export class SeekBar extends PureComponent<SeekBarProps, SeekBarState> {
  private static initialState: SeekBarState = {
    ignoreTimeupdate: false,
    isSeeking: false,
    sliderTime: 0,
    duration: 0,
    seekable: [],
    pausedDueToScrubbing: false,
    width: 0,
  };

  private _seekBlockingTimeout: NodeJS.Timeout | undefined;
  private _clearIsScrubbingTimout: NodeJS.Timeout | undefined;

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
      sliderTime: player.currentTime,
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

  private _onTimeUpdate = (event: TimeUpdateEvent) => {
    if (!this.state.ignoreTimeupdate) {
      this.setState({ sliderTime: event.currentTime });
    }
  };
  private _onLoadedMetadata = (event: LoadedMetadataEvent) => this.setState({ duration: event.duration });
  private _onDurationChange = (event: DurationChangeEvent) => this.setState({ duration: event.duration });
  private _onProgress = (event: ProgressEvent) => this.setState({ seekable: event.seekable });

  private _onSlidingStart = (value: number) => {
    this.setState({ sliderTime: value });
    this._prepareSeekStart();
    const player = (this.context as UiContext).player;
    if (!player.paused) {
      this.debounceSeek(value);
      player.pause();
      this.setState({ pausedDueToScrubbing: true });
    }
  };

  private _onValueChange = (value: number) => {
    this.setState({ sliderTime: value });
    if (this.state.ignoreTimeupdate) {
      this.debounceSeek(value);
    }
  };

  private _onSlidingComplete = (value: number) => {
    this.setState({ sliderTime: value });
    this.debounceSeek(value, true);
    const player = (this.context as UiContext).player;
    const isEnded = player.currentTime === player.duration;
    if (this.state.pausedDueToScrubbing && !isEnded) {
      player.play();
      this.setState({ pausedDueToScrubbing: false });
    }
    this._finishSeek();
  };

  private readonly _prepareSeekStart = () => {
    this.setState({ isSeeking: true, ignoreTimeupdate: true });
    clearTimeout(this._clearIsScrubbingTimout);
  };

  private readonly _finishSeek = () => {
    this.setState({ isSeeking: false });
    // Wait for timeupdate events to settle after seeking, so the Slider does not jump back and forth.
    this._clearIsScrubbingTimout = setTimeout(() => {
      this.setState({ ignoreTimeupdate: false });
    }, 1000);
  };

  private debounceSeek = (value: number, force = false) => {
    // Don't bombard the player with seeks when seeking. Allow only one seek ever X milliseconds:
    const MAX_SEEK_INTERVAL = 200;
    if (force || this._seekBlockingTimeout === undefined) {
      if (force) {
        clearTimeout(this._seekBlockingTimeout);
        this._seekBlockingTimeout = undefined;
      }
      this._seekBlockingTimeout = setTimeout(() => {
        this._seekBlockingTimeout = undefined;
      }, MAX_SEEK_INTERVAL);
      // Do seek
      const player = (this.context as UiContext).player;
      player.currentTime = value;
    }
  };

  render() {
    const { seekable, sliderTime, duration, isSeeking, width } = this.state;
    const { style } = this.props;
    const seekableStart = seekable.length > 0 ? seekable[0].start : 0;
    const seekableEnd = seekable.length > 0 ? seekable[seekable.length - 1].end : 0; // TODO what if it's fragmented?
    return (
      <PlayerContext.Consumer>
        {(context: UiContext) => (
          <View
            style={[StyleSheet.absoluteFill, style]}
            onLayout={(event: LayoutChangeEvent) => {
              this.setState({ width: event.nativeEvent.layout.width });
            }}>
            {isSeeking && (
              <SingleThumbnailView seekableStart={seekableStart} seekableEnd={seekableEnd} currentTime={sliderTime} seekBarWidth={width} />
            )}
            <Slider
              disabled={!(duration > 0) && seekable.length > 0}
              style={[StyleSheet.absoluteFill, style]}
              minimumValue={seekableStart}
              maximumValue={seekableEnd}
              step={1000}
              onSlidingStart={this._onSlidingStart}
              onValueChange={this._onValueChange}
              onSlidingComplete={this._onSlidingComplete}
              value={sliderTime}
              focusable={true}
              minimumTrackTintColor={context.style.colors.primary}
              maximumTrackTintColor="#000000"
              thumbTintColor={context.style.colors.primary}
            />
          </View>
        )}
      </PlayerContext.Consumer>
    );
  }
}

SeekBar.contextType = PlayerContext;
