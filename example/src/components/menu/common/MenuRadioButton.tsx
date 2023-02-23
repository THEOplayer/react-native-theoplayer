import { Text, TouchableOpacity } from 'react-native';
import React from 'react';
import { PlayerContext, UiContext } from '../../util/PlayerContext';

export interface MenuRowProps {
  label: string;
  id: number;
  selected?: boolean;
  onSelect: (id: number) => void;
}

export const MenuRadioButton = (props: MenuRowProps) => {
  const { id, onSelect, label, selected } = props;
  return (
    <TouchableOpacity
      onPress={() => {
        onSelect(id);
      }}>
      <PlayerContext.Consumer>
        {(context: UiContext) => (
          <Text
            style={[
              context.style.menu.row,
              selected ? { color: context.style.colors.secondary, backgroundColor: context.style.colors.text } : { color: context.style.colors.text },
            ]}>
            {label}
          </Text>
        )}
      </PlayerContext.Consumer>
    </TouchableOpacity>
  );
};
