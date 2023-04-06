import React from 'react';
import { MenuButton } from './common/MenuButton';
import { SettingsSvg } from '../button/svg/SettingsSvg';
import { MenuView } from './common/MenuView';
import { ScrollableMenu } from './common/ScrollableMenu';
import type { StyleProp, ViewStyle } from 'react-native';

export interface SettingsMenuButtonProps {
  /**
   * Overrides for the style of the menu.
   */
  menuStyle?: StyleProp<ViewStyle>;
}

/**
 * A button component that opens a settings menu containing all children for the `react-native-theoplayer` UI.
 */
export const SettingsMenuButton = (props: React.PropsWithChildren<SettingsMenuButtonProps>) => {
  const { children, menuStyle } = props;
  const createMenu = () => {
    return <MenuView style={menuStyle} menu={<ScrollableMenu title={'Settings'} items={children} />} />;
  };

  return <MenuButton svg={<SettingsSvg />} menuConstructor={createMenu} />;
};
