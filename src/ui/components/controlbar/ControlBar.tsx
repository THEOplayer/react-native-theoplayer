import React, { ReactNode } from 'react';
import { StyleProp, View, ViewStyle } from 'react-native';
import { DEFAULT_CENTER_CONTROL_BAR_HEIGHT, DEFAULT_CONTROL_BAR_HEIGHT } from '../../THEOplayerTheme';

/**
 * The default style for the control bar.
 */
export const DEFAULT_CONTROL_BAR_STYLE: ViewStyle = {
  flexDirection: 'row',
  justifyContent: 'flex-end',
  height: DEFAULT_CONTROL_BAR_HEIGHT,
};

interface ControlBarProps {
  /**
   * The style overrides for the control bar.
   */
  style?: StyleProp<ViewStyle>;
}

/**
 * A control bar component that renders all children horizontally.
 */
export const ControlBar = (props: React.PropsWithChildren<ControlBarProps>) => {
  const { style, children } = props;
  return <View style={[DEFAULT_CONTROL_BAR_STYLE, style]}>{children}</View>;
};

interface CenteredControlBarProps {
  /**
   * The style overrides for the control bar.
   */
  style?: StyleProp<ViewStyle>;
  /**
   * The component that will be placed in the left slot.
   */
  left?: ReactNode;
  /**
   * The component that will be placed in the middle slot.
   */
  middle?: ReactNode;
  /**
   * The component that will be placed in the right slot.
   */
  right?: ReactNode;
}

/**
 * A control bar that can only render 3 properties in the left/middle/right. This is used to create controls in the center of the player.
 */
export const CenteredControlBar = (props: CenteredControlBarProps) => {
  const { style, middle, left, right } = props;
  return (
    <ControlBar style={[{ height: DEFAULT_CENTER_CONTROL_BAR_HEIGHT, width: '100%', justifyContent: 'space-between' }, style]}>
      <View style={{ height: DEFAULT_CENTER_CONTROL_BAR_HEIGHT }}>{left}</View>
      {middle}
      <View style={{ height: DEFAULT_CENTER_CONTROL_BAR_HEIGHT }}>{right}</View>
    </ControlBar>
  );
};
