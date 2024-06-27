import { CustomSubMenu, Option } from './CustomSubMenu';
import * as React from 'react';
import type { StyleProp, ViewStyle } from 'react-native';
import { useContext } from 'react';
import { PlayerContext } from '@theoplayer/react-native-ui/src/ui/components/util/PlayerContext';

export interface PipSubMenuProps {
  /**
   * Overrides for the style of the menu.
   */
  menuStyle?: StyleProp<ViewStyle>;
}

export function PiPSubMenu(props?: PipSubMenuProps) {
  const player = useContext(PlayerContext).player;

  return <CustomSubMenu
    title={'Automatically Start Picture-in-Picture'}
    menuStyle={props?.menuStyle}
    label={'Auto PiP'}
    options={[{ label: 'Disabled', value: false }, { label: 'Enabled', value: true }]}
    onOptionSelected={(option: Option<boolean>) => {
      if (player) {
        player.pipConfiguration = { startsAutomatically: option.value };
      }
    }}
    currentOption={() => player.pipConfiguration.startsAutomatically ?? false} />;
}
