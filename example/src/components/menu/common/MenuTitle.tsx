import { StyleProp, Text, TextStyle } from 'react-native';
import React from 'react';
import { PlayerContext, UiContext } from '../../util/PlayerContext';

export interface MenuTitleProps {
  label: string;
  style: StyleProp<TextStyle>;
}

export const DEFAULT_MENU_TITLE_STYLE: TextStyle = {
  fontSize: 20,
  lineHeight: 24,
  padding: 10,
  textAlign: 'center',
  fontWeight: 'bold',
};

export const MenuTitle = (props: MenuTitleProps) => {
  const { label, style } = props;
  return (
    <PlayerContext.Consumer>
      {(context: UiContext) => <Text style={[DEFAULT_MENU_TITLE_STYLE, { color: context.style.colors.text }, style]}>{label}</Text>}
    </PlayerContext.Consumer>
  );
};
