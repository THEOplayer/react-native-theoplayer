import React, { PureComponent, ReactNode } from 'react';
import { Animated, StyleProp, StyleSheet, View, ViewStyle } from 'react-native';
import { PlayerContext } from '../util/Context';

interface SlotViewProps {
  style?: StyleProp<ViewStyle>;
  top?: ReactNode;
  center?: ReactNode;
  bottom?: ReactNode;
}

const slotViewStyle = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
    flexDirection: 'column',
    justifyContent: 'space-between',
    zIndex: 1,
  },
  topSlot: {
    paddingTop: 10,
    paddingLeft: 10,
    paddingRight: 10,
  },
  centerSlot: {},
  bottomSlot: {
    backgroundColor: '#00000066',
    paddingBottom: 10,
    paddingLeft: 10,
    paddingRight: 10,
  },
});

interface SlotViewState {
  fadeAnim: Animated.Value;
}

export class SlotView extends PureComponent<React.PropsWithChildren<SlotViewProps>, SlotViewState> {
  constructor(props: SlotViewProps) {
    super(props);
  }

  render() {
    const { style, top, center, bottom, children } = this.props;
    return (
      <>
        <View style={[slotViewStyle.container]}>
          <View style={[slotViewStyle.container, style]}>
            <View style={slotViewStyle.topSlot}>{top}</View>
            <View style={slotViewStyle.centerSlot}>{center}</View>
            <View style={slotViewStyle.bottomSlot}>{bottom}</View>
            {children}
          </View>
        </View>
      </>
    );
  }
}

SlotView.contextType = PlayerContext;
