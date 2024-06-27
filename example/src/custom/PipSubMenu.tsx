import { CustomSubMenu, Option } from './CustomSubMenu';
import * as React from 'react';
import type { StyleProp, ViewStyle } from 'react-native';
import { useContext } from 'react';
import { PlayerContext } from '@theoplayer/react-native-ui';

export interface PipSubMenuProps {
  /**
   * Overrides for the style of the menu.
   */
  menuStyle?: StyleProp<ViewStyle>;
}

export function PiPSubMenu(props?: PipSubMenuProps) {
  const ctx = useContext(PlayerContext);

  return <CustomSubMenu
    title={'Automatically Start Picture-in-Picture'}
    menuStyle={props?.menuStyle}
    label={'Auto PiP'}
    options={[{ label: 'Disabled', value: false }, { label: 'Enabled', value: true }]}
    onOptionSelected={(option: Option<boolean>) => {
      ctx.player.pipConfiguration = { startsAutomatically: option.value };
    }}
    currentOption={() => ctx.player.pipConfiguration.startsAutomatically ?? false} />;
}
