import React from 'react';
import { MenuButton, MenuRadioButton, MenuView, ScrollableMenu } from '@theoplayer/react-native-ui';
import type { StyleProp, ViewStyle } from 'react-native';
import { ExtensionSvg } from '../res/ExtensionSvg';

export interface ExtensionMenuButtonProps {
  /**
   * Overrides for the style of the menu.
   */
  menuStyle?: StyleProp<ViewStyle>;
}

/**
 * A button component that opens a media cache menu.
 */
export const ExtensionMenuButton = (props: React.PropsWithChildren<ExtensionMenuButtonProps>) => {
  if (!props.children) {
    return <></>;
  }
  return (
    <MenuButton
      svg={<ExtensionSvg />}
      menuConstructor={() => <MenuView style={props.menuStyle} menu={<ScrollableMenu title={'Extensions'} items={props.children} />} />}
    />
  );
};

export const ExtensionButton = ({ label, onPress }: { label: string; onPress?: () => void }) => (
  <MenuRadioButton label={label} uid={0} onSelect={() => onPress?.()} />
);
