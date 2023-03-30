import React, { ReactNode } from 'react';
import { StyleProp, View, ViewStyle } from 'react-native';
import { BUTTON_SIZE } from '../../THEOplayerTheme';

const CENTER_CONTROL_BAR_HEIGHT = 52;

export const DEFAULT_CONTROL_BAR_STYLE: ViewStyle = {
  flexDirection: 'row',
  justifyContent: 'flex-end',
  height: BUTTON_SIZE,
};

interface ControlBarProps {
  style?: StyleProp<ViewStyle>;
}

export const ControlBar = (props: React.PropsWithChildren<ControlBarProps>) => {
  const { style, children } = props;
  return <View style={[DEFAULT_CONTROL_BAR_STYLE, style]}>{children}</View>;
};

interface CenteredControlBarProps {
  style?: StyleProp<ViewStyle>;
  left?: ReactNode;
  middle?: ReactNode;
  right?: ReactNode;
}

export const CenteredControlBar = (props: CenteredControlBarProps) => {
  const { style, middle, left, right } = props;
  return (
    <ControlBar style={[{ height: CENTER_CONTROL_BAR_HEIGHT, width: '100%', justifyContent: 'space-between' }, style]}>
      <ControlBar style={[{ height: CENTER_CONTROL_BAR_HEIGHT, justifyContent: 'center', flexGrow: 1 }, style]}>{left}</ControlBar>
      {middle}
      <ControlBar style={[{ height: CENTER_CONTROL_BAR_HEIGHT, justifyContent: 'center', flexGrow: 1 }, style]}>{right}</ControlBar>
    </ControlBar>
  );
};
