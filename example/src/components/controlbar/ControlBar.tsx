import React, { ReactNode } from 'react';
import { StyleProp, View, ViewStyle } from 'react-native';
import { PlayerContext, UiContext } from '../util/PlayerContext';
import { CENTER_BUTTON_SIZE } from '../THEOplayerStyle';
import { Spacer } from './Spacer';

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
      {(context: UiContext) => <View style={[context.style.controlBar.container, style]}>{children}</View>}
    </PlayerContext.Consumer>
  );
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
