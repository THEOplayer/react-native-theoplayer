import React from 'react';
import { View } from 'react-native';
import { MenuButton } from './common/MenuButton';
import { SettingsSvg } from '../button/svg/SettingsSvg';
import { MenuView } from './common/MenuView';
import { ScrollableMenu } from './common/ScrollableMenu';
import { QualitySubMenu } from './QualitySubMenu';
import { PlaybackRateSubMenu } from './PlaybackRateSubMenu';

export const SettingsMenuButton = () => {
  const createMenu = () => {
    return (
      <MenuView
        menu={
          <ScrollableMenu
            title={'Settings'}
            items={
              <View>
                <QualitySubMenu />
                <PlaybackRateSubMenu />
              </View>
            }
          />
        }
      />
    );
  };

  return <MenuButton svg={<SettingsSvg />} menuConstructor={createMenu} />;
};
