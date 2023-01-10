import React, { ReactNode } from 'react';
import { StyleProp, StyleSheet, View, ViewStyle } from 'react-native';

export type SlotType = 'top' | 'bottom' | 'center';

interface ControlBarProps {
  style?: StyleProp<ViewStyle>;
  slot?: SlotType;
  left?: ReactNode;
  right?: ReactNode;
}

export const BUTTON_SIZE = 40;
export const CENTER_BUTTON_SIZE = 48;

export const controlBarStyle = StyleSheet.create({
  bar: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    zIndex: 1,
    height: BUTTON_SIZE,
  },
  menuIcon: {
    width: BUTTON_SIZE,
    height: BUTTON_SIZE,
  },
  castButton: {
    width: BUTTON_SIZE,
    height: BUTTON_SIZE,
    tintColor: 'white',
  },
  castIcon: {
    width: BUTTON_SIZE,
    height: BUTTON_SIZE,
  },
  container: {
    alignSelf: 'center',
  },
  image: {
    resizeMode: 'contain',
    width: BUTTON_SIZE,
    height: BUTTON_SIZE,
    tintColor: 'white',
  },
  centerControls: {
    width: CENTER_BUTTON_SIZE,
    height: CENTER_BUTTON_SIZE,
  },
});

export const SplitControlBar = (props: ControlBarProps) => {
  const { style, left, right } = props;
  return (
    <View style={[controlBarStyle.bar, style]}>
      {left}
      <View style={{ flexGrow: 1 }} />
      {right}
    </View>
  );
};

export const ControlBar = (props: React.PropsWithChildren<ControlBarProps>) => {
  const { style, children } = props;
  return <View style={[controlBarStyle.bar, style]}>{children}</View>;
};
