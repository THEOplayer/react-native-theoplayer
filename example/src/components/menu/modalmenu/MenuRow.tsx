import { Text, TouchableOpacity } from 'react-native';
import React from 'react';
import type { MenuItem } from './MenuItem';
import { PlayerContext, PlayerWithStyle } from '../../util/Context';

export interface MenuRowProps {
  onSelected?: () => void;
  selected?: boolean;
  hasTVPreferredFocus?: boolean;
  data: MenuItem;
}

export const MenuRow = (props: MenuRowProps) => {
  const { selected, onSelected, hasTVPreferredFocus, data } = props;
  const { label } = data;
  return (
    <TouchableOpacity
      hasTVPreferredFocus={hasTVPreferredFocus}
      onPress={() => {
        if (onSelected) {
          onSelected();
        }
      }}>
      <PlayerContext.Consumer>
        {(context: PlayerWithStyle) => (
          <Text style={{ color: selected ? context.style.colors.accent : context.style.colors.primary, fontSize: 16, marginVertical: 5 }}>
            {label}
          </Text>
        )}
      </PlayerContext.Consumer>
    </TouchableOpacity>
  );
};
