import React, { ReactNode } from 'react';
import { SafeAreaView, ScrollView, View, ViewStyle } from 'react-native';
import { MenuTitle } from './MenuTitle';

interface ScrollableMenuProps {
  /**
   * The title of the scrollable menu.
   */
  title: string;
  /**
   * The items to be put in the scrollable menu.
   */
  items?: ReactNode;
}

/**
 * The default style for the scrollable menu.
 */
export const DEFAULT_SCROLLABLE_MENU_STYLE: ViewStyle = {
  flex: 1,
  left: 0,
  right: 0,
  top: 0,
  bottom: 0,
  paddingRight: 10,
};

/**
 * A menu component that provides a ScrollView for menu items for the `react-native-theoplayer` UI.
 * @param props
 * @constructor
 */
export const ScrollableMenu = (props: ScrollableMenuProps) => {
  const { title, items } = props;
  return (
    <SafeAreaView style={DEFAULT_SCROLLABLE_MENU_STYLE}>
      <MenuTitle label={title} />
      <ScrollView>
        <View style={{ flexDirection: 'column' }}>{items}</View>
      </ScrollView>
    </SafeAreaView>
  );
};
