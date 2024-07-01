import React, { useState } from 'react';
import type { StyleProp, ViewStyle } from 'react-native';
import { MenuRadioButton, MenuView, ScrollableMenu, SubMenuWithButton } from '@theoplayer/react-native-ui';

export interface Option<T> {
  label: string;
  value: T;
}

export interface CustomSubMenuProps<T> {
  /**
   * Overrides for the style of the menu.
   */
  menuStyle?: StyleProp<ViewStyle>;

  /**
   * The label displayed in the menu.
   */
  label: string;

  /**
   * The title displayed when opening the menu.
   */
  title: string;

  /**
   * List of available options.
   */
  options: Option<T>[];

  /**
   * Get the current active option.
   */
  currentOption: () => T;

  /**
   * Called when a new option was selected.
   */
  onOptionSelected?: (option: Option<T>) => void;
}

/**
 * A button component that opens a custom selection menu for the `react-native-theoplayer` UI.
 */
export function CustomSubMenu<T>(props: CustomSubMenuProps<T>) {
  const { options, label } = props;
  const currentLabel = options.find(v => v.value == props.currentOption())?.label ?? "";
  const createMenu = () => {
    return <CustomSelectionView {...props}/>;
  };
  return <SubMenuWithButton menuConstructor={createMenu} label={label} preview={currentLabel} />;
}

function CustomSelectionView<T>(props: CustomSubMenuProps<T>) {
  const { menuStyle, options } = props;
  const currentOption = options.find(v => v.value == props.currentOption());
  const [selectedOption, setSelectedOption] = useState<Option<T> | undefined>(currentOption);

  const onSelectOption = (id: number | undefined): void => {
    if (id !== undefined) {
      const newSelection = id < options.length ? options[id] : undefined;
      if (newSelection) {
        setSelectedOption(newSelection);
        props.onOptionSelected?.(newSelection);
      }
    }
  };

  return (
    <MenuView
      style={menuStyle}
      menu={
        <ScrollableMenu
          title={props.title}
          items={options.map((option, id) => (
            <MenuRadioButton
              key={id}
              label={option.label}
              uid={id}
              onSelect={onSelectOption}
              selected={selectedOption?.value === option.value}></MenuRadioButton>
          ))}
        />
      }
    />
  );
}
