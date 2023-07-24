import React, { useContext, useState } from 'react';
import type { StyleProp, ViewStyle } from 'react-native';
import { MenuRadioButton, MenuView, PlayerContext, ScrollableMenu, SubMenuWithButton } from '@theoplayer/react-native-ui';

export interface PipSubMenuProps {
  /**
   * Overrides for the style of the menu.
   */
  menuStyle?: StyleProp<ViewStyle>;
}

interface Option {
  label: string;
  value: boolean;
}

const OptionAutoDisabled = { label: 'Disabled', value: false };
const OptionAutoEnabled = { label: 'Enabled', value: true };
const options: Option[] = [OptionAutoDisabled, OptionAutoEnabled];

/**
 * A button component that opens a PiP configuration selection menu for the `react-native-theoplayer` UI.
 */
export const PiPSubMenu = (props: PipSubMenuProps) => {
  const { menuStyle } = props;
  const createMenu = () => {
    return <PiPSelectionView style={menuStyle} />;
  };
  const player = useContext(PlayerContext).player;
  const selectedLabel = player.pipConfiguration.startsAutomatically ? OptionAutoEnabled.label : OptionAutoDisabled.label;
  return <SubMenuWithButton menuConstructor={createMenu} label={'Auto PiP'} preview={selectedLabel} />;
};

export interface PiPSelectionViewProps {
  style?: StyleProp<ViewStyle>;
}

const PiPSelectionView = (props: PiPSelectionViewProps) => {
  const { style } = props;
  const player = useContext(PlayerContext).player;

  const [selected, setSelected] = useState<Option>(player.pipConfiguration.startsAutomatically ? OptionAutoEnabled : OptionAutoDisabled);

  const onSelectOption = (id: number | undefined): void => {
    if (id !== undefined) {
      player.pipConfiguration = { startsAutomatically: options[id].value };
      setSelected(options[id]);
    }
  };

  return (
    <MenuView
      style={style}
      menu={
        <ScrollableMenu
          title={'Automatically Start Picture-in-Picture'}
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
