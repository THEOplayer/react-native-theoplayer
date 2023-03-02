import { StyleProp, Text, TextStyle } from 'react-native';
import React, { PureComponent } from 'react';
import { DurationChangeEvent, PlayerEventType, TimeUpdateEvent } from 'react-native-theoplayer';
import { PlayerContext, UiContext } from '../util/PlayerContext';

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
    const player = (this.context as UiContext).player;
    player.addEventListener(PlayerEventType.TIME_UPDATE, this.onTimeUpdate);
    player.addEventListener(PlayerEventType.DURATION_CHANGE, this.onDurationChange);
    this.setState({ currentTime: player.currentTime, duration: player.duration });
  }

  componentWillUnmount() {
    const player = (this.context as UiContext).player;
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
        <PlayerContext.Consumer>
          {(context: UiContext) => (
            <Text style={[context.style.videoPlayer.timeLabel, { color: context.style.colors.text }, style]}>{LIVE_LABEL}</Text>
          )}
        </PlayerContext.Consumer>
      );
    }

    try {
      let currentTimeLabel = new Date(currentTime).toISOString().substring(11, 19);
      let durationLabel = new Date(duration).toISOString().substring(11, 19);
      if (durationLabel.startsWith('00:')) {
        // Don't render hours if not needed.
        currentTimeLabel = currentTimeLabel.slice(3);
        durationLabel = durationLabel.slice(3);
      }
      const label = showDuration ? `${currentTimeLabel} / ${durationLabel}` : currentTimeLabel;
      return (
        <PlayerContext.Consumer>
          {(context: UiContext) => <Text style={[context.style.videoPlayer.timeLabel, { color: context.style.colors.text }, style]}>{label}</Text>}
        </PlayerContext.Consumer>
      );
    } catch (ignore) {
      return <></>;
    }
  }
}

TimeLabel.contextType = PlayerContext;
