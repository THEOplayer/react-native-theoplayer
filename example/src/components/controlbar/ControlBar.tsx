import React, { ReactNode } from 'react';
import { StyleProp, View, ViewStyle } from 'react-native';
import { BUTTON_SIZE, CENTER_BUTTON_SIZE } from '../THEOplayerStyle';
import { Spacer } from './Spacer';

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
    <ControlBar style={[{ height: CENTER_BUTTON_SIZE }, style]}>
      <Spacer grow={3} />
      {left}
      <Spacer />
      {middle}
      <Spacer />
      {right}
      <Spacer grow={3} />
    </ControlBar>
  );
};
