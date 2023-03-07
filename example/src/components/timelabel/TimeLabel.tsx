import type { StyleProp, TextStyle } from 'react-native';
import React, { PureComponent } from 'react';
import { DurationChangeEvent, PlayerEventType, TimeUpdateEvent } from 'react-native-theoplayer';
import { PlayerContext, UiContext } from '../util/PlayerContext';
import { StaticTimeLabel } from './StaticTimeLabel';

export interface TimeLabelProps {
  showDuration: boolean;
  style?: StyleProp<TextStyle>;
}

export interface TimeLabelState {
  currentTime: number;
  duration: number;
}

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
    return (
      <StaticTimeLabel
        showDuration={showDuration}
        time={currentTime}
        duration={duration}
        style={[this.context.style.timeLabel.container, style]}></StaticTimeLabel>
    );
  }
}

TimeLabel.contextType = PlayerContext;
