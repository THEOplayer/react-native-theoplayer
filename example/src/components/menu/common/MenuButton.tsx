import type { ImageSourcePropType, StyleProp, ViewStyle } from 'react-native';
import React, { ReactNode } from 'react';
import { ActionButton } from '../../button/actionbutton/ActionButton';
import { PlayerContext, UiContext } from '../../util/PlayerContext';
import type { MenuConstructor } from '../../uicontroller/UiControls';

export interface NewMenuButtonProps {
  icon?: ImageSourcePropType;
  svg?: ReactNode;
  style?: StyleProp<ViewStyle>;
  menuConstructor: MenuConstructor;
}

export const MenuButton = (props: NewMenuButtonProps) => {
  const { icon, svg, style, menuConstructor } = props;

  return (
    <>
      <PlayerContext.Consumer>
        {(context: UiContext) => (
          <ActionButton
            svg={svg}
            icon={icon}
            iconStyle={context.style.controlBar.buttonIcon}
            onPress={() => {
              context.ui.openMenu_(menuConstructor);
            }}
            style={style}
            touchable={true}
          />
        )}
      </PlayerContext.Consumer>
    </>
  );
};
