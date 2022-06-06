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
import styles from './SeekBar.style';
import {
  SeekBarProps,
  SKIP_FORWARD_MSEC_DEFAULT,
  SKIP_BACKWARD_MSEC_DEFAULT,
  SEEK_TIMER_DELAY_MSEC,
  TIMEUPDATES_AFTER_SEEKING,
} from './SeekBarProps';
import type { SeekBarPosition } from './SeekBarPosition';

interface SeekBarState {
  focused: boolean;
  isScrubbing: boolean;
  waitForTimeUpdates: number;
  seekTime: number;
  lastUpdateTime: number;
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

  constructor(props: SeekBarProps) {
    super(props);
    this.state = { focused: false, waitForTimeUpdates: 0, seekTime: 0, isScrubbing: false, lastUpdateTime: 0 };
    if (!Platform.isTV) {
      this.initSeekPanResponder();
    }
  }

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
    const { onScrubbingPositionChanged, currentTime: prevTime } = this.props;

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
    const { onSeek } = this.props;
    if (onSeek) {
      onSeek(seekTime);
      this.setState({ isScrubbing: false, waitForTimeUpdates: TIMEUPDATES_AFTER_SEEKING });
    }
  }

  private seekForward() {
    const { isScrubbing, seekTime } = this.state;
    const { currentTime, skipForwardMsec } = this.props;
    const skip = skipForwardMsec ?? SKIP_FORWARD_MSEC_DEFAULT;
    const newSeekTime = isScrubbing ? seekTime + skip : currentTime + skip;
    this.onSeekingPositionChanged(newSeekTime);
  }

  private seekBackward() {
    const { isScrubbing, seekTime } = this.state;
    const { currentTime, skipBackwardMsec } = this.props;
    const skip = skipBackwardMsec ?? SKIP_BACKWARD_MSEC_DEFAULT;
    const newSeekTime = isScrubbing ? seekTime - skip : currentTime - skip;
    this.onSeekingPositionChanged(newSeekTime);
  }

  componentDidMount() {
    if (Platform.isTV) {
      this.enableTVEventHandler();
    }
  }

  componentWillUnmount() {
    if (Platform.isTV) {
      this.disableTVEventHandler();
    }
  }

  componentDidUpdate(prevProps: Readonly<SeekBarProps>, prevState: Readonly<SeekBarState>) {
    const { isScrubbing: wasScrubbing } = prevState;
    const { isScrubbing, waitForTimeUpdates } = this.state;
    const { onStartScrubbing, onStopScrubbing, currentTime } = this.props;
    const { currentTime: prevTime } = prevProps;

    if (waitForTimeUpdates > 0 && currentTime !== prevTime) {
      this.setState({ waitForTimeUpdates: waitForTimeUpdates - 1 });
    }

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
    const { seekable } = this.props;
    return seekable.length > 0 ? seekable[0].start : 0;
  }

  private get duration(): number {
    const { seekable, duration } = this.props;
    const validDuration = isNaN(duration) ? 0 : duration;
    return seekable.length > 0 ? seekable[seekable.length - 1].end - seekable[0].start : validDuration;
  }

  private get currentProgress(): number {
    const { currentTime } = this.props;
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
    const { currentTime } = this.props;
    const { isScrubbing, seekTime } = this.state;
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
  };

  onFocus = () => {
    this.setState({ focused: true });
  };

  onBlur = () => {
    this.setState({ focused: false });
  };

  onDotPress = () => {
    const { onDotPress } = this.props;
    if (onDotPress) {
      onDotPress();
    }
  };

  render() {
    const currentProgressPercentage = this.currentProgressPercentage;
    const flexCompleted = currentProgressPercentage * 100;
    const flexRemaining = (1 - currentProgressPercentage) * 100;
    const { focused } = this.state;
    const { style, progressDotStyle, renderTopComponent, renderBottomComponent } = this.props;

    return (
      <View style={{ flex: 1, flexDirection: 'column' }}>
        {renderTopComponent && renderTopComponent(this.seekBarPosition)}

        <View style={[styles.container, style]}>
          {Platform.isTV && (
            <TouchableOpacity
              ref={this.setScrubberArea}
              hasTVPreferredFocus={true}
              tvParallaxProperties={{ enabled: false }}
              activeOpacity={1.0}
              style={styles.progress}
              onFocus={this.onFocus}
              onBlur={this.onBlur}
              onPress={this.onDotPress}
              onLayout={this.measureScrubber}>
              <View style={[styles.innerProgressCompleted, { flex: flexCompleted, backgroundColor: focused ? '#ffc50f' : '#ffc50faa' }]} />
              {focused && <View style={[styles.progressDot, progressDotStyle]} />}
              <View style={[styles.innerProgressRemaining, { flex: flexRemaining }]} />
            </TouchableOpacity>
          )}

          {!Platform.isTV && (
            <View style={styles.progress}>
              <View style={[styles.innerProgressCompleted, { flex: flexCompleted, backgroundColor: '#ffc50f' }]} />
              <View
                style={[styles.progressDot, { zIndex: 1 }, progressDotStyle]}
                hitSlop={styles.progressHitSlop}
                {...this._seekPanResponder.panHandlers}
              />
              <View style={[styles.innerProgressRemaining, { flex: flexRemaining }]} />
              <TouchableOpacity
                ref={this.setScrubberArea}
                style={styles.touchable}
                hitSlop={styles.progressHitSlop}
                onPress={this.onTouchScrubber}
                onLayout={this.measureScrubber}
              />
            </View>
          )}
        </View>

        {renderBottomComponent && renderBottomComponent(this.seekBarPosition)}
      </View>
    );
  }
}
