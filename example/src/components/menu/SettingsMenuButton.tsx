import React from 'react';
import { MenuButton } from './common/MenuButton';
import { SettingsSvg } from '../button/svg/SettingsSvg';
import { MenuView } from './common/MenuView';
import { ScrollableMenu } from './common/ScrollableMenu';

export const SettingsMenuButton = (props: React.PropsWithChildren<unknown>) => {
  const { children } = props;
  const createMenu = () => {
    return <MenuView menu={<ScrollableMenu title={'Settings'} items={children} />} />;
  };

  return <MenuButton svg={<SettingsSvg />} menuConstructor={createMenu} />;
};
