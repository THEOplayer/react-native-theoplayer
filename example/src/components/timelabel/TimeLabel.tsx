import { StyleProp, Text, TextStyle } from 'react-native';
import React from 'react';
import styles from './TimeLabel.style';

export interface TimeLabelProps {
  currentTime: number;
  duration: number;
  isLive: boolean;
  showDuration: boolean;
  style?: StyleProp<TextStyle>;
}
const LIVE_LABEL = 'LIVE';

export const TimeLabel = (props: TimeLabelProps) => {
  const { currentTime, duration, isLive, style, showDuration } = props;

  // An unknown duration is reported as NaN.
  if (isNaN(duration)) {
    return <></>;
  }

  // Live streams report an Infinity duration.
  if (isLive || !isFinite(duration)) {
    return <Text style={[styles.timeLabel, style]}>{LIVE_LABEL}</Text>;
  }

  try {
    const renderHours = duration >= 3600 * 1e3;
    const s = renderHours ? 11 : 14;
    const currentTimeLabel = new Date(currentTime).toISOString().substring(s, 19);
    const durationLabel = new Date(duration).toISOString().substring(s, 19);
    const label = showDuration ? `${currentTimeLabel} / ${durationLabel}` : currentTimeLabel;
    return <Text style={[styles.timeLabel, style]}>{label}</Text>;
  } catch (ignore) {
    return <></>;
  }
};

TimeLabel.defaultProps = {
  showDuration: true,
};
