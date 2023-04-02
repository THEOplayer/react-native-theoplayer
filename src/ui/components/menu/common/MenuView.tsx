import React, { ReactNode, useContext } from 'react';
import { PlayerContext, UiContext } from '../../util/PlayerContext';
import { Platform, StyleProp, StyleSheet, Text, TouchableOpacity, View, ViewStyle } from 'react-native';
import { ControlBar } from '../../controlbar/ControlBar';
import { BackButton } from '../../button/BackButton';
import { TOP_CONTAINER_STYLE } from '../../uicontroller/UiContainer';

interface MenuViewProps {
  menu: ReactNode;
  style?: StyleProp<ViewStyle>;
}

export const DEFAULT_MENU_VIEW_STYLE: ViewStyle = {
  flex: 1,
  flexDirection: 'row',
  left: 0,
  right: 0,
  top: 0,
  bottom: 0,
  paddingVertical: 20,
  paddingLeft: 50,
  paddingRight: 40,
};

export const MenuView = (props: MenuViewProps) => {
  const { menu, style } = props;
  const context = useContext(PlayerContext);
  const onClose = () => {
    context.ui.closeCurrentMenu_();
  };
  return (
    <PlayerContext.Consumer>
      {(context: UiContext) => (
        <View style={StyleSheet.absoluteFill}>
          <ControlBar style={TOP_CONTAINER_STYLE}>
            <View style={{ flexDirection: 'row' }}>
              <TouchableOpacity style={{ flexDirection: 'row' }} onPress={onClose} {...(Platform.OS === 'web' ? { onClick: onClose } : {})}>
                <BackButton onClose={onClose} />
                <Text style={{ color: context.style.colors.text, fontSize: 16, lineHeight: 30 }}>Back</Text>
              </TouchableOpacity>
            </View>

            <View style={{ flexGrow: 1 }} />
          </ControlBar>
          <View style={[DEFAULT_MENU_VIEW_STYLE, style]}>{menu}</View>
        </View>
      )}
    </PlayerContext.Consumer>
  );
};
