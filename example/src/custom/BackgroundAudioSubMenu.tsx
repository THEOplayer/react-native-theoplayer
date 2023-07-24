import React, { useContext, useState } from 'react';
import type { StyleProp, ViewStyle } from 'react-native';
import { MenuRadioButton, MenuView, PlayerContext, ScrollableMenu, SubMenuWithButton } from '@theoplayer/react-native-ui';

export interface BackgroundAudioSubMenuProps {
  /**
   * Overrides for the style of the menu.
   */
  menuStyle?: StyleProp<ViewStyle>;
}

interface Option {
  label: string;
  value: boolean;
}

const OptionDisabled = { label: 'Disabled', value: false };
const OptionEnabled = { label: 'Enabled', value: true };
const options: Option[] = [OptionDisabled, OptionEnabled];

/**
 * A button component that opens a backgroundAudio selection menu for the `react-native-theoplayer` UI.
 */
export const BackgroundAudioSubMenu = (props: BackgroundAudioSubMenuProps) => {
  const { menuStyle } = props;
  const createMenu = () => {
    return <BackgroundAudioSelectionView style={menuStyle} />;
  };
  const player = useContext(PlayerContext).player;
  const selectedLabel = player.backgroundAudioConfiguration.enabled ? OptionEnabled.label : OptionDisabled.label;
  return <SubMenuWithButton menuConstructor={createMenu} label={'Bg Audio'} preview={selectedLabel} />;
};

export interface BackgroundAudioSelectionViewProps {
  style?: StyleProp<ViewStyle>;
}

const BackgroundAudioSelectionView = (props: BackgroundAudioSelectionViewProps) => {
  const { style } = props;
  const player = useContext(PlayerContext).player;

  const [selected, setSelected] = useState<Option>(player.backgroundAudioConfiguration.enabled ? OptionEnabled : OptionDisabled);

  const onSelectOption = (id: number | undefined): void => {
    if (id !== undefined) {
      player.backgroundAudioConfiguration = { enabled: options[id].value };
      setSelected(options[id]);
    }
  };

  return (
    <MenuView
      style={style}
      menu={
        <ScrollableMenu
          title={'Background Audio'}
          items={options.map((option, id) => (
            <MenuRadioButton
              key={id}
              label={option.label}
              uid={id}
              onSelect={onSelectOption}
              selected={selected.value === option.value}></MenuRadioButton>
          ))}
        />
      }
    />
  );
};
