import { Text } from 'react-native';
import React from 'react';
import { PlayerContext, UiContext } from '../../util/PlayerContext';

export interface MenuTitleProps {
  label: string;
}

export const MenuTitle = (props: MenuTitleProps) => {
  const { label } = props;
  return <PlayerContext.Consumer>{(context: UiContext) => <Text style={[context.style.MenuView.title]}>{label}</Text>}</PlayerContext.Consumer>;
};
