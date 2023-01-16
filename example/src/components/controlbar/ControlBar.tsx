import React, { ReactNode } from 'react';
import { StyleProp, View, ViewStyle } from 'react-native';
import { PlayerContext, PlayerWithStyle } from '../util/Context';

export type SlotType = 'top' | 'bottom' | 'center';

interface ControlBarProps {
  style?: StyleProp<ViewStyle>;
  slot?: SlotType;
  left?: ReactNode;
  right?: ReactNode;
}

export const ControlBar = (props: React.PropsWithChildren<ControlBarProps>) => {
  const { style, children } = props;
  return (
    <PlayerContext.Consumer>
      {(context: PlayerWithStyle) => <View style={[context.style.controlBar.container, style]}>{children}</View>}
    </PlayerContext.Consumer>
  );
};
