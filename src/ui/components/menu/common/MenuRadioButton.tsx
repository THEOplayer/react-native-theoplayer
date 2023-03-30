import { StyleProp, Text, TextStyle, TouchableOpacity } from 'react-native';
import React from 'react';
import { PlayerContext, UiContext } from '../../util/PlayerContext';

export interface MenuRowProps {
  label: string;
  uid: number | undefined;
  selected?: boolean;
  onSelect: (id: number | undefined) => void;
  style?: StyleProp<TextStyle>;
}

export const DEFAULT_MENU_BUTTON_STYLE: TextStyle = {
  fontSize: 16,
  lineHeight: 24,
  padding: 10,
  textAlign: 'center',
};

export const MenuRadioButton = (props: MenuRowProps) => {
  const { uid, onSelect, label, selected, style } = props;
  return (
    <TouchableOpacity
      onPress={() => {
        onSelect(uid);
      }}>
      <PlayerContext.Consumer>
        {(context: UiContext) => (
          <Text
            style={[
              DEFAULT_MENU_BUTTON_STYLE,
              selected ? { color: context.style.colors.secondary, backgroundColor: context.style.colors.text } : { color: context.style.colors.text },
              style,
            ]}>
            {label}
          </Text>
        )}
      </PlayerContext.Consumer>
    </TouchableOpacity>
  );
};
