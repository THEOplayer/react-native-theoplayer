import { CustomSubMenu, Option } from './CustomSubMenu';
import { RenderingTarget } from 'react-native-theoplayer';
import * as React from 'react';
import type { StyleProp, ViewStyle } from 'react-native';
import { useContext } from 'react';
import { PlayerContext } from '@theoplayer/react-native-ui';

export interface RenderingTargetSubMenuProps {
  /**
   * Overrides for the style of the menu.
   */
  menuStyle?: StyleProp<ViewStyle>;
}

export function RenderingTargetSubMenu(props?: RenderingTargetSubMenuProps) {
  const { player } = useContext(PlayerContext);

  return (
    <CustomSubMenu
      title={'Rendering Target'}
      menuStyle={props?.menuStyle}
      label={'Display'}
      options={[
        { label: 'Surface', value: RenderingTarget.SURFACE_VIEW },
        {
          label: 'Texture',
          value: RenderingTarget.TEXTURE_VIEW,
        },
      ]}
      onOptionSelected={(option: Option<RenderingTarget>) => {
        // eslint-disable-next-line react-hooks/immutability
        player.renderingTarget = option.value;
      }}
      currentOption={() => player.renderingTarget ?? RenderingTarget.SURFACE_VIEW}
    />
  );
}
