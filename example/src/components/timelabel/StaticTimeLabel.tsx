import { StyleProp, Text, TextStyle } from 'react-native';
import React from 'react';
import { PlayerContext, UiContext } from '../util/PlayerContext';

export interface TimeLabelProps {
  showDuration: boolean;
  style?: StyleProp<TextStyle>;
  time: number;
  duration: number;
}

const LIVE_LABEL = 'LIVE';

export function StaticTimeLabel(props: TimeLabelProps) {
  const { style, showDuration, time, duration } = props;

  // An unknown duration is reported as NaN.
  if (isNaN(duration)) {
    return <></>;
  }

  // Live streams report an Infinity duration.
  if (!isFinite(duration)) {
    return (
      <PlayerContext.Consumer>
        {(context: UiContext) => <Text style={[context.style.videoPlayer.timeLabel, { color: context.style.colors.text }, style]}>{LIVE_LABEL}</Text>}
      </PlayerContext.Consumer>
    );
  }

  try {
    let currentTimeLabel = new Date(time).toISOString().substring(11, 19);
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
