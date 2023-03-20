import { PlayerContext, UiContext } from '../../util/PlayerContext';
import { StyleProp, Text, View, ViewStyle } from 'react-native';
import React from 'react';
import { MenuButton } from './MenuButton';
import { ForwardSvg } from '../../button/svg/ForwardSvg';
import type { MenuConstructor } from '../../uicontroller/UiControls';

export interface SubMenuButtonProps {
  style?: StyleProp<ViewStyle>;
  menuConstructor: MenuConstructor;
  label: string;
  preview: string;
}

export const SubMenuWithButton = (props: SubMenuButtonProps) => {
  const { style, menuConstructor, label, preview } = props;
  return (
    <PlayerContext.Consumer>
      {(context: UiContext) => (
        <View style={[style, { flexDirection: 'row', width: '100%', justifyContent: 'center' }]}>
          <Text style={[context.style.menu.row, { color: context.style.colors.text, width: '30%' }]}>{label}</Text>
          <View style={{ flexDirection: 'row', width: '60%', justifyContent: 'center' }}>
            <View style={{ flexDirection: 'row' }}>
              <Text style={[context.style.menu.row, { color: context.style.colors.text }]}>{preview}</Text>
              <MenuButton svg={<ForwardSvg />} menuConstructor={menuConstructor} />
            </View>
          </View>
        </View>
      )}
    </PlayerContext.Consumer>
  );
};
