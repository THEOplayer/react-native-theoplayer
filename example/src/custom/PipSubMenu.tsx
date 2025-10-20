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
  const { player } = useContext(PlayerContext);

  return (
    <>
      <CustomSubMenu
        title={'Automatically Start Picture-in-Picture'}
        menuStyle={props?.menuStyle}
        label={'Auto PiP'}
        options={[
          { label: 'Disabled', value: false },
          { label: 'Enabled', value: true },
        ]}
        onOptionSelected={(option: Option<boolean>) => {
          // eslint-disable-next-line react-hooks/immutability
          player.pipConfiguration = { ...player.pipConfiguration, startsAutomatically: option.value };
        }}
        currentOption={() => player.pipConfiguration.startsAutomatically ?? false}
      />
      <CustomSubMenu
        title={'Retain Picture-in-Picture on new source'}
        menuStyle={props?.menuStyle}
        label={'Retain PiP'}
        options={[
          { label: 'Disabled', value: false },
          { label: 'Enabled', value: true },
        ]}
        onOptionSelected={(option: Option<boolean>) => {
          // eslint-disable-next-line react-hooks/immutability
          player.pipConfiguration = { ...player.pipConfiguration, retainPipOnSourceChange: option.value };
        }}
        currentOption={() => player.pipConfiguration.retainPipOnSourceChange ?? false}
      />
    </>
  );
}
