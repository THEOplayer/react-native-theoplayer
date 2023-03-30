import React, { ReactNode } from 'react';
import { SafeAreaView, ScrollView, View, ViewStyle } from 'react-native';
import { MenuTitle } from './MenuTitle';

interface ScrollableMenuProps {
  title: string;
  items?: ReactNode;
}

export const DEFAULT_SCROLLABLE_MENU_STYLE: ViewStyle = {
  flex: 1,
  left: 0,
  right: 0,
  top: 0,
  bottom: 0,
  paddingRight: 10,
};

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
