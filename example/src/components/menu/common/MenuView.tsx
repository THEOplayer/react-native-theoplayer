import React, { ReactNode, useContext } from 'react';
import { PlayerContext, UiContext } from '../../util/PlayerContext';
import { StyleSheet, Text, View } from 'react-native';
import { ControlBar } from '../../controlbar/ControlBar';
import { BackButton } from '../../button/BackButton';

interface MenuViewProps {
  menu: ReactNode;
  previousMenu?: ReactNode;
}

export const MenuView = (props: MenuViewProps) => {
  const { menu, previousMenu } = props;
  const context = useContext(PlayerContext);
  const onClose = () => {
    context.ui.setMenu_(previousMenu);
  };
  return (
    <PlayerContext.Consumer>
      {(context: UiContext) => (
        <View style={StyleSheet.absoluteFill}>
          <ControlBar style={context.style.slotView.topSlot}>
            <BackButton onClose={onClose} />
            <Text style={{ color: context.style.colors.text, fontSize: 16, lineHeight: 30 }}>Back</Text>
            <View style={{ flexGrow: 1 }} />
          </ControlBar>
          <View style={[context.style.menu.container]}>{menu}</View>
        </View>
      )}
    </PlayerContext.Consumer>
  );
};
