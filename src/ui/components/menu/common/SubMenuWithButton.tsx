import { PlayerContext, UiContext } from '../../util/PlayerContext';
import { StyleProp, Text, TextStyle, View, ViewStyle } from 'react-native';
import React from 'react';
import { MenuButton } from './MenuButton';
import { ArrowForwardSvg } from '../../button/svg/ArrowForwardSvg';
import type { MenuConstructor } from '../../uicontroller/UiControls';
import { DEFAULT_MENU_BUTTON_STYLE } from './MenuRadioButton';

export interface SubMenuButtonProps {
  style?: StyleProp<ViewStyle>;
  textStyle?: StyleProp<TextStyle>;
  menuConstructor: MenuConstructor;
  label: string;
  preview: string;
}

export const SubMenuWithButton = (props: SubMenuButtonProps) => {
  const { style, textStyle, menuConstructor, label, preview } = props;
  return (
    <PlayerContext.Consumer>
      {(context: UiContext) => (
        <View style={[{ height: 44, flexDirection: 'row', width: '100%', justifyContent: 'center' }, style]}>
          <Text style={[DEFAULT_MENU_BUTTON_STYLE, { color: context.style.colors.text, width: '30%' }, textStyle]}>{label}</Text>
          <View style={{ flexDirection: 'row', width: '60%', justifyContent: 'center' }}>
            <View style={{ flexDirection: 'row' }}>
              <Text style={[DEFAULT_MENU_BUTTON_STYLE, { color: context.style.colors.text }, textStyle]}>{preview}</Text>
              <MenuButton svg={<ArrowForwardSvg />} menuConstructor={menuConstructor} />
            </View>
          </View>
        </View>
      )}
    </PlayerContext.Consumer>
  );
};
