import type { ImageSourcePropType, StyleProp, ViewStyle } from 'react-native';
import React, { ReactNode } from 'react';
import { ActionButton } from '../../button/actionbutton/ActionButton';
import { PlayerContext, UiContext } from '../../util/PlayerContext';

export interface NewMenuButtonProps {
  icon?: ImageSourcePropType;
  svg?: ReactNode;
  style?: StyleProp<ViewStyle>;
  menu: ReactNode;
}

export const MenuButton = (props: NewMenuButtonProps) => {
  const { icon, svg, style, menu } = props;

  return (
    <>
      <PlayerContext.Consumer>
        {(context: UiContext) => (
          <ActionButton
            svg={svg}
            icon={icon}
            iconStyle={context.style.controlBar.buttonIcon}
            onPress={() => {
              context.ui.setMenu_(menu);
            }}
            style={style}
            touchable={true}
          />
        )}
      </PlayerContext.Consumer>
    </>
  );
};
