import { CustomSubMenu, Option } from './CustomSubMenu';
import * as React from 'react';
import type { StyleProp, ViewStyle } from 'react-native';
import { useContext } from 'react';
import { PlayerContext } from '@theoplayer/react-native-ui';

export interface BackgroundAudioSubMenuProps {
  /**
   * Overrides for the style of the menu.
   */
  menuStyle?: StyleProp<ViewStyle>;
}

/**
 * A button component that opens a backgroundAudio selection menu for the `react-native-theoplayer` UI.
 */
export const BackgroundAudioSubMenu = (props?: BackgroundAudioSubMenuProps) => {
  const ctx = useContext(PlayerContext);

  return <CustomSubMenu
    title={'Background Audio'}
    menuStyle={props?.menuStyle}
    label={'Bg Audio'}
    options={[{ label: 'Disabled', value: false }, { label: 'Enabled', value: true }]}
    onOptionSelected={(option: Option<boolean>) => {
      if (ctx.player) {
        ctx.player.backgroundAudioConfiguration = { enabled: option.value };
      }
    }}
    currentOption={() => ctx.player.pipConfiguration.startsAutomatically ?? false} />;
}
