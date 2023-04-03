import type { ImageSourcePropType, StyleProp, ViewStyle } from 'react-native';
import React, { ReactNode } from 'react';
import { ActionButton } from '../../button/actionbutton/ActionButton';
import { PlayerContext, UiContext } from '../../util/PlayerContext';
import type { MenuConstructor } from '../../uicontroller/UiControls';

export interface MenuButtonProps {
  /**
   * The image that will be used in the button.
   */
  icon?: ImageSourcePropType;
  /**
   * The SVG that will be used in the button. Takes priority over images.
   */
  svg?: ReactNode;
  /**
   * The style overrides for the menu button.
   */
  style?: StyleProp<ViewStyle>;
  /**
   * The menu that will be constructed when the button is pressed.
   */
  menuConstructor?: MenuConstructor;
}

/**
 * A menu button that opens a fullscreen menu for in the `react-native-theoplayer` UI.
 */
export const MenuButton = (props: MenuButtonProps) => {
  const { icon, svg, style, menuConstructor } = props;

  return (
    <PlayerContext.Consumer>
      {(context: UiContext) => (
        <ActionButton
          svg={svg}
          icon={icon}
          onPress={() => {
            if (menuConstructor) {
              context.ui.openMenu_(menuConstructor);
            }
          }}
          style={style}
          touchable={true}
        />
      )}
    </PlayerContext.Consumer>
  );
};
