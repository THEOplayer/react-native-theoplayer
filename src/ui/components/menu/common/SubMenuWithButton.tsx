import { PlayerContext, UiContext } from '../../util/PlayerContext';
import { StyleProp, Text, TextStyle, TouchableOpacity, View, ViewStyle } from 'react-native';
import React, { useContext } from 'react';
import { ArrowForwardSvg } from '../../button/svg/ArrowForwardSvg';
import type { MenuConstructor } from '../../uicontroller/UiControls';
import { DEFAULT_MENU_BUTTON_STYLE } from './MenuRadioButton';
import { ActionButton } from '../../button/actionbutton/ActionButton';

export interface SubMenuButtonProps {
  /**
   * The style overrides.
   */
  style?: StyleProp<ViewStyle>;
  /**
   * The style overrides for the text components.
   */
  textStyle?: StyleProp<TextStyle>;
  /**
   * The sub menu that will be opened.
   */
  menuConstructor: MenuConstructor;
  /**
   * The label for the sub menu button.
   */
  label: string;
  /**
   * A preview for the currently selected value before opening the sub menu.
   */
  preview: string;
}

/**
 * A component that can be put inside a SettingsMenuButton to create a sub menu.
 */
export const SubMenuWithButton = (props: SubMenuButtonProps) => {
  const { style, textStyle, menuConstructor, label, preview } = props;
  const context = useContext(PlayerContext);
  const onTouch = () => {
    if (menuConstructor) {
      context.ui.openMenu_(menuConstructor);
    }
  };
  return (
    <PlayerContext.Consumer>
      {(context: UiContext) => (
        <View style={[{ height: 44, flexDirection: 'row', width: '100%', justifyContent: 'center' }, style]}>
          <Text style={[DEFAULT_MENU_BUTTON_STYLE, { color: context.style.colors.text, width: '30%' }, textStyle]}>{label}</Text>
          <View style={{ flexDirection: 'row', width: '60%', justifyContent: 'center' }}>
            <TouchableOpacity style={{ flexDirection: 'row' }} onPress={onTouch}>
              <Text style={[DEFAULT_MENU_BUTTON_STYLE, { color: context.style.colors.text }, textStyle]}>{preview}</Text>
              <ActionButton touchable={false} svg={<ArrowForwardSvg />} />
            </TouchableOpacity>
          </View>
        </View>
      )}
    </PlayerContext.Consumer>
  );
};
