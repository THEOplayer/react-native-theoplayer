import { Text, TouchableOpacity } from 'react-native';
import React from 'react';
import { PlayerContext, UiContext } from '../../util/PlayerContext';

export interface MenuRowProps {
  label: string;
  uid: number | undefined;
  selected?: boolean;
  onSelect: (id: number | undefined) => void;
}

export const MenuRadioButton = (props: MenuRowProps) => {
  const { uid, onSelect, label, selected } = props;
  return (
    <TouchableOpacity
      onPress={() => {
        onSelect(uid);
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
