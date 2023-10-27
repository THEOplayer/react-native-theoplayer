import React from 'react';
import { MenuButton, MenuView, ScrollableMenu } from '@theoplayer/react-native-ui';
import type { StyleProp, ViewStyle } from 'react-native';
import { MediaCacheSvg } from '../res/MediaCacheSvg';

export interface MediaCacheMenuButtonProps {
  /**
   * Overrides for the style of the menu.
   */
  menuStyle?: StyleProp<ViewStyle>;
}

/**
 * A button component that opens a media cache menu.
 */
export const MediaCacheMenuButton = (props: React.PropsWithChildren<MediaCacheMenuButtonProps>) => {
  const { children, menuStyle } = props;
  const createMenu = () => {
    return <MenuView style={menuStyle} menu={<ScrollableMenu title={'Media Cache'} items={children} />} />;
  };

  return <MenuButton svg={<MediaCacheSvg />} menuConstructor={createMenu} />;
};
