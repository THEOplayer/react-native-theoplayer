import React, { useContext } from 'react';
import { ListSvg, MenuButton, MenuRadioButton, MenuView, PlayerContext, ScrollableMenu } from '@theoplayer/react-native-ui';
import { usePlaylist } from '../context/PlaylistContext';

export const SourceMenuButton = () => {
  const createMenu = () => {
    return <SourceMenuView />;
  };
  return <MenuButton svg={<ListSvg />} menuConstructor={createMenu} />;
};

export const SourceMenuView = () => {
  const { ui } = useContext(PlayerContext);
  // The playlist is owned by the app, so opening or closing this menu does not affect the player's
  // media control handlers or the currently selected playlist index.
  const { sources: filteredSources, currentIndex, setSourceByIndex } = usePlaylist();

  const selectSource = (id: number | undefined) => {
    setSourceByIndex(id);
    ui.closeCurrentMenu_();
  };
  return (
    <MenuView
      menu={
        <ScrollableMenu
          title={'Source'}
          items={filteredSources.map((source, id) => (
            <MenuRadioButton key={id} label={source.name} uid={id} onSelect={selectSource} selected={id === currentIndex}></MenuRadioButton>
          ))}
        />
      }
    />
  );
};
