import React, { ReactNode } from 'react';
import { StyleProp, View, ViewStyle } from 'react-native';
import { PlayerContext, UiContext } from '../util/PlayerContext';

/**
 * The default style for the control bar.
 */
export const DEFAULT_CONTROL_BAR_STYLE: ViewStyle = {
  flexDirection: 'row',
  justifyContent: 'flex-end',
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
  return (
    <PlayerContext.Consumer>
      {(context: UiContext) => (
        <View style={[DEFAULT_CONTROL_BAR_STYLE, { height: context.style.dimensions.controlBarHeight }, style]}>{children}</View>
      )}
    </PlayerContext.Consumer>
  );
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
    <PlayerContext.Consumer>
      {(context: UiContext) => (
        <ControlBar style={[{ height: context.style.dimensions.centerControlBarHeight, width: '100%', justifyContent: 'space-between' }, style]}>
          <View style={{ height: context.style.dimensions.centerControlBarHeight }}>{left}</View>
          {middle}
          <View style={{ height: context.style.dimensions.centerControlBarHeight }}>{right}</View>
        </ControlBar>
      )}
    </PlayerContext.Consumer>
  );
};
