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
  const { player } = useContext(PlayerContext);

  return (
    <>
      <CustomSubMenu
        title={'Background Audio: activation'}
        menuStyle={props?.menuStyle}
        label={'BG Audio'}
        options={[
          { label: 'Disabled', value: false },
          { label: 'Enabled', value: true },
        ]}
        onOptionSelected={(option: Option<boolean>) => {
          // eslint-disable-next-line react-hooks/immutability
          player.backgroundAudioConfiguration = { ...player.backgroundAudioConfiguration, enabled: option.value };
        }}
        currentOption={() => player.backgroundAudioConfiguration.enabled ?? false}
      />
      <CustomSubMenu
        title={'Background Audio: interruption handling'}
        menuStyle={props?.menuStyle}
        label={'Interrupts'}
        options={[
          { label: 'Pause', value: false },
          { label: 'Resume', value: true },
        ]}
        onOptionSelected={(option: Option<boolean>) => {
          // eslint-disable-next-line react-hooks/immutability
          player.backgroundAudioConfiguration = { ...player.backgroundAudioConfiguration, shouldResumeAfterInterruption: option.value };
        }}
        currentOption={() => player.backgroundAudioConfiguration.shouldResumeAfterInterruption ?? false}
      />
    </>
  );
};
