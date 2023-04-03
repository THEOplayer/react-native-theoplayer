import { StyleProp, Text, TextStyle } from 'react-native';
import React from 'react';
import { PlayerContext, UiContext } from '../util/PlayerContext';

export interface StaticTimeLabelProps {
  /**
   * Whether to show the duration of the current source.
   */
  showDuration: boolean;
  /**
   * The style overrides.
   */
  style?: StyleProp<TextStyle>;
  /**
   * The current time of the player
   */
  time: number;
  /**
   * The duration of the current source.
   */
  duration: number;
}

const LIVE_LABEL = 'LIVE';

/**
 * A static time label for the `react-native-theoplayer` UI.
 */
export function StaticTimeLabel(props: StaticTimeLabelProps) {
  const { style, showDuration, time, duration } = props;

  // An unknown duration is reported as NaN.
  if (isNaN(duration)) {
    return <></>;
  }

  // Live streams report an Infinity duration.
  if (!isFinite(duration)) {
    return (
      <PlayerContext.Consumer>
        {(context: UiContext) => <Text style={[context.style.text, { color: context.style.colors.text }, style]}>{LIVE_LABEL}</Text>}
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
        {(context: UiContext) => <Text style={[context.style.text, { color: context.style.colors.text }, style]}>{label}</Text>}
      </PlayerContext.Consumer>
    );
  } catch (ignore) {
    return <></>;
  }
}
