import { Text, TouchableOpacity } from 'react-native';
import React from 'react';
import type { MenuItem } from './MenuItem';

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
      <Text style={{ color: selected ? '#ffc50f' : 'white', fontSize: 16, marginVertical: 5 }}>{label}</Text>
    </TouchableOpacity>
  );
};
