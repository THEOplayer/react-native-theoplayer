import React, { ReactNode } from 'react';
import { SafeAreaView, ScrollView, View } from 'react-native';
import { MenuTitle } from './MenuTitle';
import { PlayerContext, UiContext } from '../../util/PlayerContext';

interface ScrollableMenuProps {
  title: string;
  items?: ReactNode;
}

export const ScrollableMenu = (props: ScrollableMenuProps) => {
  const { title, items } = props;
  return (
    <PlayerContext.Consumer>
      {(context: UiContext) => (
        <SafeAreaView style={context.style.menu.menus}>
          <MenuTitle label={title} />
          <ScrollView>
            <View style={{ flexDirection: 'column' }}>{items}</View>
          </ScrollView>
        </SafeAreaView>
      )}
    </PlayerContext.Consumer>
  );
};
