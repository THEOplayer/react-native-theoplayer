import { StyleProp, Text, TextStyle, TouchableOpacity } from 'react-native';
import React from 'react';
import { PlayerContext, UiContext } from '../../util/PlayerContext';

export interface MenuRadioButtonProps {
  /**
   * The label for the button.
   */
  label: string;
  /**
   * The uid used in the callback when the button is pressed.
   */
  uid: number | undefined;
  /**
   * Whether the radio button is selected.
   */
  selected?: boolean;
  /**
   * The callback that is called when the button is pressed.
   * @param id The uid prop.
   */
  onSelect: (id: number | undefined) => void;
  /**
   * The style overrides for the radio button.
   */
  style?: StyleProp<TextStyle>;
}

export const DEFAULT_MENU_BUTTON_STYLE: TextStyle = {
  fontSize: 16,
  lineHeight: 24,
  padding: 10,
  textAlign: 'center',
};

/**
 * The default radio button that can be used in menus for the `react-native-theoplayer` UI.
 */
export const MenuRadioButton = (props: MenuRadioButtonProps) => {
  const { uid, onSelect, label, selected, style } = props;
  return (
    <TouchableOpacity
      onPress={() => {
        onSelect(uid);
      }}>
      <PlayerContext.Consumer>
        {(context: UiContext) => (
          <Text
            style={[
              DEFAULT_MENU_BUTTON_STYLE,
              selected
                ? { color: context.style.colors.textSelected, backgroundColor: context.style.colors.textSelectedBackground }
                : { color: context.style.colors.text },
              style,
            ]}>
            {label}
          </Text>
        )}
      </PlayerContext.Consumer>
    </TouchableOpacity>
  );
};
