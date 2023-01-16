import { Text, TouchableOpacity } from 'react-native';
import React from 'react';
import type { MenuItem } from './MenuItem';
import { PlayerStyleContext, VideoPlayerStyle } from '../../style/VideoPlayerStyle';

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
      <PlayerStyleContext.Consumer>
        {(styleContext: VideoPlayerStyle) => (
          <Text style={{ color: selected ? styleContext.colors.accent : styleContext.colors.primary, fontSize: 16, marginVertical: 5 }}>{label}</Text>
        )}
      </PlayerStyleContext.Consumer>
    </TouchableOpacity>
  );
};
