import React, { ReactNode, useContext } from 'react';
import { PlayerContext, UiContext } from '../../util/PlayerContext';
import { StyleProp, StyleSheet, Text, TouchableOpacity, View, ViewStyle } from 'react-native';
import { ControlBar } from '../../controlbar/ControlBar';
import { TOP_UI_CONTAINER_STYLE } from '../../uicontroller/UiContainer';
import { BackSvg } from '../../button/svg/BackSvg';
import { ActionButton } from '../../button/actionbutton/ActionButton';

interface MenuViewProps {
  /**
   * The menu to render inside the menu view.
   */
  menu: ReactNode;
  /**
   * The style overrides for the menu view.
   */
  style?: StyleProp<ViewStyle>;
}

/**
 * The default style for the menu view.
 */
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

/**
 * A component to render a fullscreen menu with a title and back button for the `react-native-theoplayer` UI.
 */
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
          <ControlBar style={TOP_UI_CONTAINER_STYLE}>
            <View style={{ flexDirection: 'row' }}>
              <TouchableOpacity style={{ flexDirection: 'row' }} onPress={onClose}>
                <ActionButton touchable={false} svg={<BackSvg />} />
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
