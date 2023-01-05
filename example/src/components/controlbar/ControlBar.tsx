import React, { ReactNode } from 'react';
import { StyleProp, StyleSheet, View, ViewStyle } from 'react-native';

export type SlotType = 'top' | 'bottom' | 'center';

interface ControlBarProps {
  style?: StyleProp<ViewStyle>;
  slot?: SlotType;
  left?: ReactNode;
  right?: ReactNode;
}

const controlBarHeight = 35;

export const controlBarStyle = StyleSheet.create({
  bar: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    zIndex: 1,
    height: controlBarHeight,
  },
  menuIcon: {
    width: 30,
    height: 30,
    margin: 5,
  },
  castButton: {
    width: 30,
    height: 30,
    tintColor: 'white',
  },
  castIcon: {
    width: 30,
    height: 30,
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
