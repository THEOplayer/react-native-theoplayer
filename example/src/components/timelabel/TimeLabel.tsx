import { StyleProp, Text, TextStyle } from 'react-native';
import React, { PureComponent } from 'react';
import { DurationChangeEvent, PlayerEventType, THEOplayerInternal, TimeUpdateEvent } from 'react-native-theoplayer';
import { PlayerContext } from '../util/Context';
import type { VideoPlayerStyle } from '../style/VideoPlayerStyle';
import { PlayerStyleContext } from '../style/VideoPlayerStyle';

export interface TimeLabelProps {
  showDuration: boolean;
  style?: StyleProp<TextStyle>;
}

export interface TimeLabelState {
  currentTime: number;
  duration: number;
}

const LIVE_LABEL = 'LIVE';

export class TimeLabel extends PureComponent<TimeLabelProps, TimeLabelState> {
  private static initialState: TimeLabelState = {
    currentTime: 0.0,
    duration: 0,
  };

  constructor(props: TimeLabelProps) {
    super(props);
    this.state = TimeLabel.initialState;
  }

  componentDidMount() {
    const player = this.context as THEOplayerInternal;
    player.addEventListener(PlayerEventType.TIME_UPDATE, this.onTimeUpdate);
    player.addEventListener(PlayerEventType.DURATION_CHANGE, this.onDurationChange);
  }

  componentWillUnmount() {
    const player = this.context as THEOplayerInternal;
    player.removeEventListener(PlayerEventType.TIME_UPDATE, this.onTimeUpdate);
    player.removeEventListener(PlayerEventType.DURATION_CHANGE, this.onDurationChange);
  }

  private onTimeUpdate = (event: TimeUpdateEvent) => {
    const { currentTime } = event;
    this.setState({ currentTime });
  };

  private onDurationChange = (event: DurationChangeEvent) => {
    const { duration } = event;
    this.setState({ duration });
  };

  render() {
    const { currentTime, duration } = this.state;
    const { style, showDuration } = this.props;

    // An unknown duration is reported as NaN.
    if (isNaN(duration)) {
      return <></>;
    }

    // Live streams report an Infinity duration.
    if (!isFinite(duration)) {
      return (
        <PlayerStyleContext.Consumer>
          {(styleContext: VideoPlayerStyle) => (
            <Text style={[styleContext.videoPlayer.timeLabel, { color: styleContext.colors.text }, style]}>{LIVE_LABEL}</Text>
          )}
        </PlayerStyleContext.Consumer>
      );
    }

    try {
      const renderHours = duration >= 3600 * 1e3;
      const s = renderHours ? 11 : 14;
      const currentTimeLabel = new Date(currentTime).toISOString().substring(s, 19);
      const durationLabel = new Date(duration).toISOString().substring(s, 19);
      const label = showDuration ? `${currentTimeLabel} / ${durationLabel}` : currentTimeLabel;
      return (
        <PlayerStyleContext.Consumer>
          {(styleContext: VideoPlayerStyle) => (
            <Text style={[styleContext.videoPlayer.timeLabel, { color: styleContext.colors.text }, style]}>{label}</Text>
          )}
        </PlayerStyleContext.Consumer>
      );
    } catch (ignore) {
      return <></>;
    }
  }
}

TimeLabel.contextType = PlayerContext;
