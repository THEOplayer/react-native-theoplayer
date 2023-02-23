import React, { PureComponent } from 'react';
import 'react-native/tvos-types.d';
import {
  findNodeHandle,
  GestureResponderEvent,
  PanResponder,
  PanResponderGestureState,
  PanResponderInstance,
  Platform,
  TouchableOpacity,
  TVEventHandler,
  View,
} from 'react-native';
import {
  SEEK_TIMER_DELAY_MSEC,
  SeekBarProps,
  SKIP_BACKWARD_MSEC_DEFAULT,
  SKIP_FORWARD_MSEC_DEFAULT,
  TIMEUPDATES_AFTER_SEEKING,
} from './SeekBarProps';
import type { SeekBarPosition } from './SeekBarPosition';
import {
  DurationChangeEvent,
  filterThumbnailTracks,
  LoadedMetadataEvent,
  PlayerEventType,
  ProgressEvent,
  TextTrack,
  TimeRange,
  TimeUpdateEvent,
} from 'react-native-theoplayer';
import { ThumbnailView } from '../thumbnail/ThumbnailView';
import { THUMBNAIL_SIZE } from '../videoplayer/VideoPlayerUIProps';
import { PlayerContext, UiContext } from '../util/PlayerContext';

interface SeekBarState {
  focused: boolean;
  isScrubbing: boolean;
  waitForTimeUpdates: number;
  seekTime: number;
  seekable: TimeRange[];
  duration: number;
  currentTime: number;
  textTracks: TextTrack[];
}

/**
 * SeekBar provides an interactive progress component that supports both touch-based and remote-controlled devices.
 *
 * On TV platforms, a TVEventHandlers listens for left/right press events to skip forward/backward, only
 * if the SeekBar is focused.
 * When pressing 'OK', the onDotPress callback is invoked.
 *
 * On mobile devices supporting touch interaction, a PanResponder captures the scrubbing gestures.
 * Touch events on the SeekBar are interpreted as skip forward/backward.
 */
export class SeekBar extends PureComponent<SeekBarProps, SeekBarState> {
  private _width = 0;
  private _offset = 0;
  private _scrubberArea: TouchableOpacity | null = null;
  private _tvEventHandler: TVEventHandler | undefined;
  private _seekPanResponder!: PanResponderInstance;
  private _seekTimer: NodeJS.Timeout | null = null;

  private animationPauseId: number | undefined = undefined;

  private static initialState: SeekBarState = {
    textTracks: [],
    focused: false,
    waitForTimeUpdates: 0,
    seekTime: 0,
    isScrubbing: false,
    currentTime: 0.0,
    duration: 0,
    seekable: [],
  };

  constructor(props: SeekBarProps) {
    super(props);
    this.state = SeekBar.initialState;
    if (!Platform.isTV) {
      this.initSeekPanResponder();
    }
  }

  private onSeek = (time: number) => {
    const player = (this.context as UiContext).player;
    if (!isNaN(time)) {
      player.currentTime = time;
    }
  };

  private onProgress = (event: ProgressEvent) => {
    const { seekable } = event;
    this.setState({ seekable });
  };

  private initSeekPanResponder() {
    this._seekPanResponder = PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => true,
      onPanResponderTerminationRequest: () => false,
      onPanResponderGrant: () => {
        this.setState({ isScrubbing: false });
        const { onStartScrubbing } = this.props;
        if (onStartScrubbing) {
          onStartScrubbing();
        }
        if (this.animationPauseId === undefined) {
          const uiController = (this.context as UiContext).ui;
          this.animationPauseId = uiController.requestShowUiWithLock_();
        }
      },
      onPanResponderMove: (_evt: GestureResponderEvent, gestureState: PanResponderGestureState) => {
        const seekTime = this.seekableStart + (this.duration * (gestureState.moveX - this._offset)) / this._width;
        this.onSeekingPositionChanged(seekTime);
      },
      onPanResponderRelease: () => {
        // Note: isScrubbing state is disabled after a number of time updates.
        const { onStopScrubbing } = this.props;
        if (onStopScrubbing) {
          onStopScrubbing();
        }
        if (this.animationPauseId !== undefined) {
          const uiController = (this.context as UiContext).ui;
          uiController.releaseLock_(this.animationPauseId);
          this.animationPauseId = undefined;
        }
      },
    });
  }

  private enableTVEventHandler() {
    this._tvEventHandler = new TVEventHandler();
    this._tvEventHandler.enable(this, (_cmp, evt) => {
      const { focused } = this.state;
      if (!focused) {
        return;
      }
      if (Platform.OS == 'ios' && Platform.isTVOS) {
        if (evt && evt.eventType === 'swipeRight') {
          this.seekForward();
        } else if (evt && evt.eventType === 'swipeLeft') {
          this.seekBackward();
        }
      } else {
        if (evt && evt.eventType === 'right') {
          if (evt.eventKeyAction === 1) {
            this.seekForward();
          }
        } else if (evt && evt.eventType === 'left') {
          if (evt.eventKeyAction === 1) {
            this.seekBackward();
          }
        }
      }
    });
  }

  private disableTVEventHandler() {
    if (this._tvEventHandler) {
      this._tvEventHandler.disable();
      delete this._tvEventHandler;
    }
  }

  private onSeekingPositionChanged = (seekTime: number) => {
    const { onScrubbingPositionChanged } = this.props;
    const { currentTime: prevTime } = this.state;

    // clamp seekTime within seekable range.
    const clampedSeekTime = Math.max(this.seekableStart, Math.min(this.duration, seekTime));
    this.setState({ isScrubbing: true, seekTime: clampedSeekTime });

    if (this._seekTimer) {
      clearTimeout(this._seekTimer);
      this._seekTimer = null;
    }

    // avoid hammering the player with seek events, so add delay before actually notifying seek.
    this._seekTimer = setTimeout(() => {
      this.notifyDelayedSeek(clampedSeekTime);
    }, SEEK_TIMER_DELAY_MSEC);

    // optionally notify change in position.
    if (onScrubbingPositionChanged) {
      onScrubbingPositionChanged(clampedSeekTime, prevTime);
    }
  };

  private notifyDelayedSeek(seekTime: number) {
    this.onSeek(seekTime);
    this.setState({ isScrubbing: false, waitForTimeUpdates: TIMEUPDATES_AFTER_SEEKING });
  }

  private seekForward() {
    const { isScrubbing, seekTime, currentTime } = this.state;
    const { skipForwardMsec } = this.props;
    const skip = skipForwardMsec ?? SKIP_FORWARD_MSEC_DEFAULT;
    const newSeekTime = isScrubbing ? seekTime + skip : currentTime + skip;
    this.onSeekingPositionChanged(newSeekTime);
  }

  private seekBackward() {
    const { isScrubbing, seekTime, currentTime } = this.state;
    const { skipBackwardMsec } = this.props;
    const skip = skipBackwardMsec ?? SKIP_BACKWARD_MSEC_DEFAULT;
    const newSeekTime = isScrubbing ? seekTime - skip : currentTime - skip;
    this.onSeekingPositionChanged(newSeekTime);
  }

  componentDidMount() {
    if (Platform.isTV) {
      this.enableTVEventHandler();
    }
    const player = (this.context as UiContext).player;
    player.addEventListener(PlayerEventType.PROGRESS, this.onProgress);
    player.addEventListener(PlayerEventType.TIME_UPDATE, this.onTimeUpdate);
    player.addEventListener(PlayerEventType.TEXT_TRACK_LIST, this.onTextTrackListEvent);
    player.addEventListener(PlayerEventType.TEXT_TRACK, this.onTextTrackEvent);
    player.addEventListener(PlayerEventType.DURATION_CHANGE, this.onDurationChange);
    player.addEventListener(PlayerEventType.LOADED_METADATA, this.onLoadedMetadata);
  }

  componentWillUnmount() {
    if (Platform.isTV) {
      this.disableTVEventHandler();
    }
    const player = (this.context as UiContext).player;
    player.removeEventListener(PlayerEventType.PROGRESS, this.onProgress);
    player.removeEventListener(PlayerEventType.TIME_UPDATE, this.onTimeUpdate);
    player.removeEventListener(PlayerEventType.TEXT_TRACK_LIST, this.onTextTrackListEvent);
    player.removeEventListener(PlayerEventType.TEXT_TRACK, this.onTextTrackEvent);
    player.removeEventListener(PlayerEventType.DURATION_CHANGE, this.onDurationChange);
    player.removeEventListener(PlayerEventType.LOADED_METADATA, this.onLoadedMetadata);
  }

  componentDidUpdate(_: Readonly<SeekBarProps>, prevState: Readonly<SeekBarState>) {
    const { isScrubbing: wasScrubbing } = prevState;
    const { isScrubbing } = this.state;
    const { onStartScrubbing, onStopScrubbing } = this.props;

    if (!isScrubbing && wasScrubbing && onStartScrubbing) {
      onStartScrubbing();
    } else if (isScrubbing && !wasScrubbing && onStopScrubbing) {
      onStopScrubbing();
    }
  }

  setScrubberArea = (ref: TouchableOpacity | null) => {
    this._scrubberArea = ref;
    if (Platform.isTV && ref) {
      // on TV platforms we don't want to change focus when navigation left/right.
      ref.setNativeProps({
        nextFocusLeft: findNodeHandle(ref),
        nextFocusRight: findNodeHandle(ref),
      });
    }
  };

  private get seekableStart(): number {
    const { seekable } = this.state;
    return seekable.length > 0 ? seekable[0].start : 0;
  }

  private get duration(): number {
    const { seekable, duration } = this.state;
    const validDuration = isNaN(duration) ? 0 : duration;
    return seekable.length > 0 ? seekable[seekable.length - 1].end - seekable[0].start : validDuration;
  }

  private get currentProgress(): number {
    const { currentTime } = this.state;
    const { waitForTimeUpdates, isScrubbing, seekTime } = this.state;
    // use seekTime while waiting for time updates
    if (isScrubbing || waitForTimeUpdates > 0) {
      return seekTime;
    }
    return currentTime;
  }

  private get currentProgressPercentage(): number {
    const duration = this.duration;
    return duration > 0 ? (this.currentProgress - this.seekableStart) / duration : 0;
  }

  private get seekBarPosition(): SeekBarPosition {
    const { isScrubbing } = this.state;
    return {
      currentProgress: this.currentProgress,
      currentProgressPercentage: this.currentProgressPercentage,
      duration: this.duration,
      isScrubbing,
      seekBarWidth: this._width,
    };
  }

  measureScrubber = () => {
    if (this._scrubberArea) {
      this._scrubberArea.measure((_x: number, _y: number, width: number, _height: number, pageX: number) => {
        this._width = width;
        this._offset = pageX;
      });
    }
  };

  onTouchScrubber = (event: GestureResponderEvent) => {
    const { isScrubbing, seekTime, currentTime } = this.state;
    const offsetX = Platform.select({
      default: event.nativeEvent.locationX,
      web: (event.nativeEvent as unknown as PointerEvent).offsetX,
    });
    // check whether the use is touch before or after the current time.
    const newSeekTime = (this.duration * offsetX) / this._width;
    const scrubberTime = isScrubbing ? seekTime : currentTime;
    if (newSeekTime > scrubberTime) {
      this.seekForward();
    } else {
      this.seekBackward();
    }
    const uiController = (this.context as UiContext).ui;
    uiController.requestShowUi();
  };

  onFocus = () => {
    this.setState({ focused: true });
  };

  onBlur = () => {
    this.setState({ focused: false });
  };

  onDotPress = () => {
    // On TV platforms we use the progress dot to play/pause
    const player = (this.context as UiContext).player;
    if (player.paused) {
      player.play();
    } else {
      player.pause();
    }
  };

  private onTextTrackListEvent = () => {
    const player = (this.context as UiContext).player;
    this.setState({ textTracks: player.textTracks });
  };

  private onTextTrackEvent = () => {
    const player = (this.context as UiContext).player;
    this.setState({ textTracks: player.textTracks });
  };

  private onTimeUpdate = (event: TimeUpdateEvent) => {
    const { currentTime } = event;
    const { currentTime: prevTime, waitForTimeUpdates } = this.state;

    if (waitForTimeUpdates > 0 && currentTime !== prevTime) {
      this.setState({ waitForTimeUpdates: waitForTimeUpdates - 1 });
    }

    this.setState({ currentTime });
  };

  private onLoadedMetadata = (event: LoadedMetadataEvent) => {
    this.setState({
      duration: event.duration,
      textTracks: event.textTracks,
    });
  };

  private onDurationChange = (event: DurationChangeEvent) => {
    const { duration } = event;
    this.setState({ duration });
  };

  render() {
    const currentProgressPercentage = this.currentProgressPercentage;
    const flexCompleted = currentProgressPercentage * 100;
    const flexRemaining = (1 - currentProgressPercentage) * 100;
    const { focused } = this.state;
    //@ts-ignore
    const { style, progressDotStyle, thumbnailMode } = this.props;

    return (
      <PlayerContext.Consumer>
        {(context: UiContext) => (
          <View style={{ flex: 1, flexDirection: 'column', paddingHorizontal: 10 }}>
            {/* TODO {thumbnailMode === 'carousel' ? this.renderThumbnailCarousel(this.seekBarPosition) : this.renderSingleThumbnail(this.seekBarPosition)}*/}

            <View style={[context.style.seekBar.container, style]}>
              {Platform.isTV && (
                <TouchableOpacity
                  ref={this.setScrubberArea}
                  hasTVPreferredFocus={true}
                  tvParallaxProperties={{ enabled: false }}
                  activeOpacity={1.0}
                  style={context.style.seekBar.progress}
                  onFocus={this.onFocus}
                  onBlur={this.onBlur}
                  onPress={this.onDotPress}
                  onLayout={this.measureScrubber}>
                  <View
                    style={[
                      context.style.seekBar.innerProgressCompleted,
                      { flex: flexCompleted, backgroundColor: focused ? context.style.colors.accent : context.style.colors.primary },
                    ]}
                  />
                  <View
                    style={[
                      context.style.seekBar.progressDot,
                      { zIndex: 1, backgroundColor: focused ? context.style.colors.accent : context.style.colors.primary },
                      progressDotStyle,
                    ]}
                  />
                  <View style={[context.style.seekBar.innerProgressRemaining, { flex: flexRemaining }]} />
                </TouchableOpacity>
              )}

              {!Platform.isTV && (
                <View style={context.style.seekBar.progress}>
                  <View
                    style={[context.style.seekBar.innerProgressCompleted, { flex: flexCompleted, backgroundColor: context.style.colors.primary }]}
                  />
                  <View
                    style={[context.style.seekBar.progressDot, { zIndex: 1, backgroundColor: context.style.colors.primary }, progressDotStyle]}
                    hitSlop={context.style.seekBar.progressHitSlop}
                    {...this._seekPanResponder.panHandlers}
                  />
                  <View
                    style={[context.style.seekBar.innerProgressRemaining, { flex: flexRemaining, backgroundColor: context.style.colors.secondary }]}
                  />
                  <TouchableOpacity
                    ref={this.setScrubberArea}
                    style={context.style.seekBar.touchable}
                    hitSlop={context.style.seekBar.progressHitSlop}
                    onPress={this.onTouchScrubber}
                    onLayout={this.measureScrubber}
                  />
                </View>
              )}
            </View>

            {/* TODO: render bot component? {renderBottomComponent && renderBottomComponent(this.seekBarPosition)}*/}
          </View>
        )}
      </PlayerContext.Consumer>
    );
  }

  private renderThumbnailCarousel = (seekBarPosition: SeekBarPosition) => {
    const { textTracks } = this.state;
    const thumbnailTrack = filterThumbnailTracks(textTracks);
    if (!thumbnailTrack) {
      return;
    }
    return (
      <PlayerContext.Consumer>
        {(context: UiContext) => (
          <ThumbnailView
            visible={seekBarPosition.isScrubbing}
            containerStyle={context.style.videoPlayer.thumbnailContainerCarousel}
            thumbnailStyleCurrent={[context.style.videoPlayer.thumbnailCurrentCarousel, { borderColor: context.style.colors.primary }]}
            thumbnailStyleCarousel={context.style.videoPlayer.thumbnailCarousel}
            thumbnailTrack={thumbnailTrack}
            time={seekBarPosition.currentProgress}
            duration={seekBarPosition.duration}
            size={THUMBNAIL_SIZE}
            carouselCount={2}
            // Optionally scale down the thumbnails when further from currentTime.
            // carouselThumbnailScale={(index: number) => 1.0 - Math.abs(index) * 0.15}
          />
        )}
      </PlayerContext.Consumer>
    );
  };

  private renderSingleThumbnail = (seekBarPosition: SeekBarPosition) => {
    const { textTracks } = this.state;
    const thumbnailTrack = filterThumbnailTracks(textTracks);
    if (!thumbnailTrack) {
      return;
    }
    return (
      <PlayerContext.Consumer>
        {(styleContext: UiContext) => (
          <ThumbnailView
            visible={seekBarPosition.isScrubbing}
            containerStyle={styleContext.style.videoPlayer.thumbnailContainerSingle}
            thumbnailStyleCurrent={styleContext.style.videoPlayer.thumbnailCurrentSingle}
            thumbnailTrack={thumbnailTrack}
            duration={seekBarPosition.duration}
            time={seekBarPosition.currentProgress}
            size={THUMBNAIL_SIZE}
            showTimeLabel={false}
            offset={Math.min(
              seekBarPosition.seekBarWidth - THUMBNAIL_SIZE,
              Math.max(0, seekBarPosition.currentProgressPercentage * seekBarPosition.seekBarWidth - 0.5 * THUMBNAIL_SIZE),
            )}
          />
        )}
      </PlayerContext.Consumer>
    );
  };
}

SeekBar.contextType = PlayerContext;
